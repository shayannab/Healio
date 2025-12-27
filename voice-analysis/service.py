import os
import librosa
import numpy as np
import speech_recognition as sr
import soundfile as sf
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Create a thread pool for blocking operations
executor = ThreadPoolExecutor(max_workers=4)

def run_stt(file_path):
    """Blocking Speech-to-Text Operation"""
    recognizer = sr.Recognizer()
    try:
        # Robust load using soundfile (handles variances in WAV headers better)
        data, samplerate = sf.read(file_path, dtype='int16')
        
        # Ensure Mono
        if len(data.shape) > 1:
            data = data.mean(axis=1).astype(np.int16)
            
        # 1. NORMALIZE AUDIO (Boost volume)
        # Check peak amplitude
        peak = np.abs(data).max()
        if peak < 30000: # Max is 32767 for int16
            # Avoid division by zero
            if peak > 0:
                # Target peak: ~30000 (roughly -1dB)
                scaling_factor = 30000.0 / peak
                # Apply scaling and clip to int16 range
                data = (data * scaling_factor).clip(-32768, 32767).astype(np.int16)

        # Create AudioData directly from bytes
        audio_bytes = data.tobytes()
        audio_source = sr.AudioData(audio_bytes, samplerate, 2) # 2 bytes = 16-bit
        
        return recognizer.recognize_google(audio_source)
    except sr.UnknownValueError:
        return "(Audio unintelligible)"
    except Exception as e:
        print(f"STT Error: {e}")
        return f"(STT Error: {str(e)})"

def run_acoustics(file_path):
    """Blocking Librosa Operation"""
    results = {"energy": 0.0, "speed": 0.0, "pitch_var": 0.0}
    try:
        # Load audio (faster load if possible)
        y, sr_rate = librosa.load(file_path, sr=16000, duration=60)
        
        # A. Energy
        rms = librosa.feature.rms(y=y)
        results["energy"] = float(np.mean(rms))

        # B. Pitch
        f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=50, fmax=300)
        valid_f0 = f0[~np.isnan(f0)]
        results["pitch_var"] = float(np.std(valid_f0) if len(valid_f0) > 0 else 0)
        results["pitch_mean"] = float(np.mean(valid_f0) if len(valid_f0) > 0 else 0)

        # C. Speed
        onset_env = librosa.onset.onset_strength(y=y, sr=sr_rate)
        results["speed"] = float(np.mean(onset_env))
        
        return results
    except Exception as e:
        print(f"Acoustic Error: {e}")
        return results

async def analyze_audio_service(file_path: str):
    """
    Parallelized analysis of audio file.
    """
    loop = asyncio.get_event_loop()
    
    try:
        # 1. Run STT and Acoustics in Parallel
        stt_task = loop.run_in_executor(executor, run_stt, file_path)
        acoustic_task = loop.run_in_executor(executor, run_acoustics, file_path)
        
        transcript, signals = await asyncio.gather(stt_task, acoustic_task)
        
        # 2. Heuristics (Expanded)
        energy = signals.get("energy", 0)
        pitch_var = signals.get("pitch_var", 0)
        pitch_mean = signals.get("pitch_mean", 0)
        speed = signals.get("speed", 0)
        
        # Default
        insight = "Balanced State"
        
        # Logic Tree
        if energy < 0.025:
            if speed < 0.3:
                insight = "Hesitant / Low Energy"
            else:
                insight = "Quiet / Reserved"
        elif energy > 0.08:
            # Tuned Thresholds based on user feedback (Excitement vs Stress)
            if pitch_var > 30: # Lowered from 40 to catch more excitement
                insight = "Excited / Highly Expressive"
            elif pitch_mean > 210: # Raised from 180 (Stress usually very high pitch)
                insight = "High Intensity" # Removed "Stressed" to avoid false negatives
            else:
                insight = "Energetic"
        else:
            # Moderate Energy
            if pitch_var < 15:
                insight = "Monotone / Flat"
            elif speed > 0.7:
                # Differentiate Anxiety vs Excitement using Pitch Var
                if pitch_var > 20: 
                    insight = "Animated / Eager"
                else: 
                    insight = "Rushed / Anxious"
            elif speed < 0.35 and pitch_var < 25:
                insight = "Calm / Relaxed"

        return {
            "transcript": transcript,
            "signals": signals,
            "insight": insight
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "transcript": f"(Server Error: {str(e)})",
            "signals": {"energy": 0.0, "speed": 0.0, "pitch_var": 0.0},
            "insight": "Analysis Failed"
        }

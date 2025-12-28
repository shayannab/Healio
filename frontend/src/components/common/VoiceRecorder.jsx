import React, { useState, useRef } from 'react';
import { voiceAPI } from '../../services/api';
import { captureAudioAsWAV } from '../../utils/wavEncoder';

const VoiceRecorder = ({ onAnalysisComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const stopRecordingRef = useRef(null);

    const startRecording = async () => {
        try {
            setError(null);
            // captureAudioAsWAV returns a FUNCTION to stop recording
            stopRecordingRef.current = await captureAudioAsWAV(60000, (audioBlob) => {
                processAudio(audioBlob);
            });
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Could not access microphone. Check permissions.");
        }
    };

    const stopRecording = () => {
        if (stopRecordingRef.current && isRecording) {
            stopRecordingRef.current(); // Calls the cleanup and onStop callback
            setIsRecording(false);
        }
    };

    const processAudio = async (audioBlob) => {
        setIsProcessing(true);
        try {
            // Verify blob is WAV
            console.log("Sending blob:", audioBlob.type, audioBlob.size);

            const response = await voiceAPI.analyzeAudio(audioBlob);
            if (response.success && onAnalysisComplete) {
                onAnalysisComplete(response.data);
            }
        } catch (err) {
            console.error("Processing failed:", err);
            setError("Analysis failed. Backend might be offline.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="voice-recorder-container" style={{ textAlign: 'center', padding: '20px' }}>
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

            <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: isRecording ? '#dc2626' : '#4F46E5',
                    color: 'white',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease'
                }}
            >
                {isProcessing ? (
                    <span className="loader">...</span>
                ) : isRecording ? (
                    <span style={{ fontSize: '24px' }}>⏹</span>
                ) : (
                    <span style={{ fontSize: '24px' }}>🎤</span>
                )}
            </button>

            <p style={{ marginTop: '10px', fontWeight: '500', color: '#666' }}>
                {isProcessing ? "Analyzing signals..." : isRecording ? "Listening (WAV)..." : "Tap to Speak"}
            </p>
        </div>
    );
};

export default VoiceRecorder;

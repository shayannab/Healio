import faiss
import pickle
import numpy as np
import requests

# Configuration
OLLAMA_URL = "http://localhost:11434"
LLM_MODEL = "llama3"
EMBED_MODEL = "nomic-embed-text" 

# Load the FAISS brain
index = faiss.read_index('model/saved_models/brain_index.faiss')
with open('model/saved_models/brain_metadata.pkl', 'rb') as f:
    brain_data = pickle.load(f)
df = brain_data['df']

def detect_crisis(text):
    """Checks for high-risk keywords in user input"""
    crisis_keywords = [
        'suicide', 'kill myself', 'end my life', 'depression', 
        'anxiety', 'panic attack', 'self harm', 'hopeless'
    ]
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in crisis_keywords)

def get_crisis_resources():
    """Returns the emergency contact string"""
    return (
        "\n\n--- EMERGENCY SUPPORT CONTACTS ---\n"
        "Please know that you are not alone. Reach out for help:\n"
        "📞 AASRA: +91-9820466726\n"
        "📞 Sneha Foundation: +91-44-24640050\n"
        "📞 Vandrevala Foundation: 1860-2662-345\n"
        "----------------------------------"
    )

def get_response(user_input):
    # 1. CRISIS CHECK (Priority 1)
    is_crisis = detect_crisis(user_input)
    
    # 2. Semantic Search (Priority 2)
    try:
        res = requests.post(
            f'{OLLAMA_URL}/api/embed', 
            json={'model': EMBED_MODEL, 'input': [user_input]},
            timeout=10
        )
        query_vec = np.array(res.json()['embeddings']).astype('float32')
        faiss.normalize_L2(query_vec)
        _, indices = index.search(query_vec, k=1)
        best_match = df.iloc[indices[0][0]]['response']
    except Exception:
        best_match = "I'm here for you, Spandan. Tell me what's on your mind."

    # 3. Llama 3 Personality & Response Generation
    system_instruction = (
        "You are 'Mindful Companion', Spandan's empathetic AI. "
        "Your goal is to console him, validate his feelings, and provide motivation. "
        "If you detect distress, be extra gentle and warm. Speak naturally like a friend."
    )
    
    prompt = f"{system_instruction}\n\n" \
             f"Knowledge Context: {best_match}\n\n" \
             f"Spandan: {user_input}\n" \
             f"Companion:"
    
    try:
        response = requests.post(
            f'{OLLAMA_URL}/api/generate', 
            json={
                'model': LLM_MODEL, 
                'prompt': prompt, 
                'stream': False,
                'options': {'temperature': 0.7, 'num_predict': 250}
            },
            timeout=40
        )
        bot_msg = response.json()['response'].strip()
    except Exception:
        bot_msg = "I'm right here with you, Spandan. I might be having a technical glitch, but I'm listening."

    # 4. APPEND HELPLINES IF NEEDED
    if is_crisis:
        bot_msg += get_crisis_resources()
        
    return bot_msg

if __name__ == "__main__":
    while True:
        u = input("\nSpandan: ")
        if u.lower() in ['quit', 'exit']: break
        print(f"Companion: {get_response(u)}")
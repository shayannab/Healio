import os, pandas as pd, pickle, requests, numpy as np, faiss, time
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor

OLLAMA_URL = "http://localhost:11434"
EMBED_MODEL = "nomic-embed-text" 
MODEL_PATH = 'model/saved_models/brain_metadata.pkl'
FAISS_INDEX_PATH = 'model/saved_models/brain_index.faiss'
BATCH_SIZE = 128  
THREADS = 12 # Bumped for your Mac M-series chip

def get_embeddings(batch_data):
    texts, pbar = batch_data
    try:
        response = requests.post(f'{OLLAMA_URL}/api/embed', 
                                 json={'model': EMBED_MODEL, 'input': texts}, timeout=60)
        pbar.update(len(texts))
        return response.json()['embeddings']
    except:
        return [[0.0] * 768] * len(texts)

def train_semantic_model():
    print(f"🚀 FIXING AND FINISHING BRAIN...")
    df = pd.read_csv('data/processed/final_training_data.csv').dropna().reset_index(drop=True)
    texts = df['instruction'].tolist()
    
    batches = [texts[i:i + BATCH_SIZE] for i in range(0, len(texts), BATCH_SIZE)]
    all_embeddings = []
    
    start_time = time.time()
    with tqdm(total=len(texts), desc="⚡ Final Run", unit="rec") as pbar:
        with ThreadPoolExecutor(max_workers=THREADS) as executor:
            results = list(executor.map(get_embeddings, [(b, pbar) for b in batches]))
            
        for batch_result in results:
            all_embeddings.extend(batch_result)

    print("\n🏗️  Building FAISS Index...")
    embeddings_np = np.array(all_embeddings).astype('float32')
    
    # --- CRITICAL FIX HERE ---
    index = faiss.IndexFlatIP(embeddings_np.shape[1])
    faiss.normalize_L2(embeddings_np) # CAPITAL L
    index.add(embeddings_np)
    # -------------------------
    
    os.makedirs('model/saved_models', exist_ok=True)
    faiss.write_index(index, FAISS_INDEX_PATH)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump({'df': df}, f)
        
    print(f"✅ SUCCESS! Brain saved at {FAISS_INDEX_PATH}")

if __name__ == "__main__":
    train_semantic_model()
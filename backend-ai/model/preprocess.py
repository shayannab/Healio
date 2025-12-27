import pandas as pd
import json
import os

RAW_PATH = 'data/raw/'
SAVE_PATH = 'data/processed/final_training_data.csv'

def preprocess_data():
    all_data = []

    # 1. Process standard CSVs
    mapping = {
        'input': 'output',
        'Context': 'Response',
        'question': 'answer',
        'questionText': 'answerText'
    }

    for file in os.listdir(RAW_PATH):
        if not file.endswith('.csv'): continue
        
        df = pd.read_csv(os.path.join(RAW_PATH, file))
        cols = df.columns
        
        # Specific logic for sentiment_analysis.csv
        if file == 'sentiment_analysis.csv':
            # Map 'text' to instruction and create a supportive 'response'
            # Based on your input: columns are 'text', 'source', 'label'
            tmp = df[['text', 'label']].copy().rename(columns={'text': 'instruction'})
            # We assign a default supportive response to negative labels
            # Assuming label '0' or 'negative' means bad mood
            tmp['response'] = tmp['label'].apply(lambda x: "I'm so sorry you're feeling this way. I'm here to listen." if str(x).lower() in ['0', 'negative', 'sad'] else "I'm glad to hear that!")
            all_data.append(tmp[['instruction', 'response']])
            continue

        # Standard conversation merging
        for inst_col, resp_col in mapping.items():
            if inst_col in cols and resp_col in cols:
                tmp = df[[inst_col, resp_col]].rename(columns={inst_col: 'instruction', resp_col: 'response'})
                all_data.append(tmp)
                break

    # 2. Process JSON files
    for file in os.listdir(RAW_PATH):
        if file.endswith('.json'):
            with open(os.path.join(RAW_PATH, file), 'r') as f:
                data = json.load(f)
                if 'intents' in data:
                    for intent in data['intents']:
                        for pattern in intent['patterns']:
                            for resp in intent['responses']:
                                all_data.append(pd.DataFrame({'instruction': [pattern], 'response': [resp]}))
                elif isinstance(data, list) and 'input' in data[0]:
                    tmp = pd.DataFrame(data).rename(columns={'input': 'instruction', 'output': 'response'})
                    all_data.append(tmp[['instruction', 'response']])

    final_df = pd.concat(all_data, ignore_index=True).dropna().drop_duplicates()
    final_df.to_csv(SAVE_PATH, index=False)
    print(f"✅ Success! {len(final_df)} rows merged into {SAVE_PATH}")

if __name__ == "__main__":
    preprocess_data()
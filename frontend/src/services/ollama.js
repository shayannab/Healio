export async function askOllama(transcript) {
    const prompt = `Analyze this digital behavior log: ${transcript}. Identify Intent vs Outcome bias. Provide a Balance Score (X/10) and 3 recovery steps. Be concise.`;

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3',
                prompt: prompt,
                stream: false
            })
        });
        const data = await response.json();
        return data.response;
    } catch (e) {
        return "Digital analysis is currently offline. Please ensure Ollama is running.";
    }
}
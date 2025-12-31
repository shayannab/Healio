/**
 * ChatAssistant Component
 * "Healio" themed AI companion interface
 */
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { PetalSpirit } from '../common/KawaiiCharacters';
import { chatAPI } from '../../services/api';

function ChatAssistant() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi Spandan! ✨ I'm Petal. How are you feeling right now?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        const userText = inputText.trim();
        if (!userText) return;

        // 1. Add User Message to UI
        const userMsg = {
            id: Date.now(),
            text: userText,
            sender: 'user',
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // 2. Real API Call to your Flask/Ollama backend
        try {
            const data = await chatAPI.sendMessage(userText); 
            
            const aiMsg = {
                id: Date.now() + 1,
                text: data.text, // Ensure your API returns { text: "..." }
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat Error:", error);
            
            const errorMsg = {
                id: Date.now() + 1,
                text: "I'm having a little trouble connecting to my brain. Please ensure Ollama and the Flask server are running!",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="chat-container slide-up" style={{
            height: 'calc(100vh - 250px)', 
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-warm)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            margin: '0 10px'
        }}>

            {/* Header Area */}
            <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid var(--border-soft)', background: 'white' }}>
                <div style={{ margin: '0 auto 8px auto', width: '50px', height: '50px' }}>
                    <PetalSpirit size={50} />
                </div>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Healio Chat</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI Wellness Companion</p>
            </div>

            {/* Messages Area */}
            <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '8px' }}>
                        {msg.sender === 'ai' && (
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'white', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PetalSpirit size={20} />
                            </div>
                        )}
                        <div style={{
                            maxWidth: '80%',
                            padding: '10px 14px',
                            borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                            background: msg.sender === 'user' ? 'var(--indigo-600)' : 'white',
                            color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: '0.9rem'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="typing-dot">Thinking...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '15px', background: 'white', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Message Petal..."
                    style={{ flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid var(--border-medium)', outline: 'none' }}
                />
                <button type="submit" disabled={!inputText.trim() || isTyping} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--indigo-600)', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}

export default ChatAssistant;
/**
 * ChatAssistant Component
 * "Healio" themed AI companion interface
 */
import { useState, useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';
import { PetalSpirit } from '../common/KawaiiCharacters';
import { chatAPI } from '../../services/api';

function ChatAssistant() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi there! I'm Petal. How are you feeling today?",
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
        if (!inputText.trim()) return;

        // 1. Add User Message
        const userMsg = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // 2. Simulate or Call API
        try {
            // For now, simple mock delay if API isn't ready, or real call
            // const response = await chatAPI.sendMessage(inputText); 
            // Mock response since backend might not be 100% ready
            setTimeout(() => {
                const aiMsg = {
                    id: Date.now() + 1,
                    text: "I hear you. Tell me more about that?",
                    sender: 'ai',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMsg]);
                setIsTyping(false);
            }, 1500);

        } catch (error) {
            console.error("Chat Error", error);
            setIsTyping(false);
        }
    };

    return (
        <div className="chat-container slide-up" style={{
            height: 'calc(100vh - 180px)', // Fit between header and nav
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-warm)',
            borderRadius: '24px 24px 0 0', // Rounded top like a card coming up
            overflow: 'hidden',
            position: 'relative'
        }}>

            {/* Header Area */}
            <div style={{
                padding: '24px',
                textAlign: 'center',
                borderBottom: '1px solid var(--border-soft)'
            }}>
                <div style={{ margin: '0 auto 8px auto', width: '60px', height: '60px' }}>
                    <PetalSpirit size={60} />
                </div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Healio Chat</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your personal wellness companion</p>
            </div>

            {/* Messages Area */}
            <div className="chat-messages" style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            alignItems: 'flex-end',
                            gap: '8px'
                        }}
                    >
                        {msg.sender === 'ai' && (
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: 'white', border: '1px solid var(--border-medium)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '4px'
                            }}>
                                <PetalSpirit size={24} />
                            </div>
                        )}

                        <div style={{
                            maxWidth: '75%',
                            padding: '12px 16px',
                            borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                            background: msg.sender === 'user' ? 'var(--sage)' : 'white',
                            color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: '0.95rem',
                            lineHeight: '1.5'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <PetalSpirit size={24} />
                        </div>
                        <div className="typing-indicator" style={{
                            padding: '12px 16px', background: 'white', borderRadius: '20px',
                            color: 'var(--text-secondary)', fontSize: '0.8rem'
                        }}>
                            Thinking...
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{
                padding: '20px',
                background: 'white',
                borderTop: '1px solid var(--border-soft)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
            }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                        flex: 1,
                        padding: '12px 20px',
                        borderRadius: '24px',
                        border: '1px solid var(--border-medium)',
                        outline: 'none',
                        fontSize: '1rem',
                        background: 'var(--bg-cream)',
                        color: 'var(--text-primary)'
                    }}
                />
                <button
                    type="submit"
                    disabled={!inputText.trim()}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: inputText.trim() ? 'var(--sage)' : 'var(--bg-gray-100)',
                        border: 'none',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: inputText.trim() ? 'pointer' : 'default',
                        transition: 'all 0.2s'
                    }}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}

export default ChatAssistant;

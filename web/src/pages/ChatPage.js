import React, { useState, useEffect } from 'react';
import './ChatPage.css';
import { theme } from '../theme';
import CompanionAvatarWeb from '../components/CompanionAvatarWeb';

const COMPANIONS = [
  { id: 'arch', name: 'Archlord' },
  { id: 'data', name: 'Data' },
  { id: 'para', name: 'Para' },
  { id: 'secu', name: 'Secu' },
  { id: 'bio',  name: 'Bio' },
  { id: 'ubu',  name: 'Ubu' },
  { id: 'art',  name: 'Art' },
];

const ChatPage = () => {
  const [activeCompanion, setActiveCompanion] = useState('data');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial greeting
    fetch('https://viral-stick.vercel.app/api/memes/chat/greeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companionId: activeCompanion })
    })
    .then(res => res.json())
    .then(data => {
      setMessages([{ id: Date.now(), text: data.reply, sender: 'companion' }]);
    });
  }, [activeCompanion]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://viral-stick.vercel.app/api/memes/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companionId: activeCompanion, message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now(), text: data.reply, sender: 'companion' }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now(), text: "Erreur de connexion", sender: 'companion' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-page" style={{ backgroundColor: theme.colors.background }}>
      <div className="sidebar">
        {COMPANIONS.map(c => (
          <button 
            key={c.id} 
            onClick={() => setActiveCompanion(c.id)}
            className={activeCompanion === c.id ? 'active' : ''}
            style={{ 
              borderColor: activeCompanion === c.id ? theme.colors[c.id] : 'transparent' 
            }}
          >
            <CompanionAvatarWeb companion={c.id} size={40} />
            <span>{c.name}</span>
          </button>
        ))}
      </div>
      
      <div className="chat-main">
        <header>
          <CompanionAvatarWeb companion={activeCompanion} size={60} />
          <h2 style={{ color: theme.colors[activeCompanion] }}>Chat avec {activeCompanion.toUpperCase()}</h2>
        </header>

        <div className="messages">
          {messages.map(m => (
            <div key={m.id} className={`message ${m.sender}`}>
              <p style={{ backgroundColor: m.sender === 'user' ? theme.colors.arch : theme.colors.card }}>{m.text}</p>
            </div>
          ))}
          {loading && <p>...</p>}
        </div>

        <div className="input-area">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Message..."
          />
          <button onClick={sendMessage} disabled={loading}>Envoyer</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

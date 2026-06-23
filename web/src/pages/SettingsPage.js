import React, { useState } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [keys, setKeys] = useState({
    GEMINI_API_KEY: '',
    MISTRAL_API_KEY: '',
    DEEPSEEK_API_KEY: ''
  });
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    // In a real scenario, this should be handled securely.
    // For local testing purposes, we send keys to a debug endpoint.
    setStatus('Saving...');
    try {
      const response = await fetch('https://viral-stick.vercel.app/api/debug/update-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keys)
      });
      if (response.ok) {
        setStatus('Keys updated successfully (session only).');
      } else {
        setStatus('Error updating keys.');
      }
    } catch (e) {
      setStatus('Failed to connect to backend.');
    }
  };

  return (
    <div className="settings-page">
      <h2>Paramètres API</h2>
      <div className="field">
        <label>Gemini API Key</label>
        <input type="password" value={keys.GEMINI_API_KEY} onChange={e => setKeys({...keys, GEMINI_API_KEY: e.target.value})} />
      </div>
      <div className="field">
        <label>Mistral API Key</label>
        <input type="password" value={keys.MISTRAL_API_KEY} onChange={e => setKeys({...keys, MISTRAL_API_KEY: e.target.value})} />
      </div>
      <div className="field">
        <label>DeepSeek API Key</label>
        <input type="password" value={keys.DEEPSEEK_API_KEY} onChange={e => setKeys({...keys, DEEPSEEK_API_KEY: e.target.value})} />
      </div>
      <button onClick={handleSave}>Enregistrer</button>
      <p>{status}</p>
    </div>
  );
};

export default SettingsPage;

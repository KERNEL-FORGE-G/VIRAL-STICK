import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import RemixPage from './pages/RemixPage';
import ContextPage from './pages/ContextPage';
import SettingsPage from './pages/SettingsPage';
import { theme } from './theme';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app" style={{ backgroundColor: theme.colors.background, minHeight: '100vh', color: theme.colors.text }}>
        <nav className="navbar" style={{ padding: '1rem', display: 'flex', gap: '1rem', borderBottom: `1px solid ${theme.colors.border}` }}>
          <Link to="/">Home</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/remix">Remix</Link>
          <Link to="/context">Context</Link>
          <Link to="/settings">Settings</Link>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/remix" element={<RemixPage />} />
          <Route path="/context" element={<ContextPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import RemixPage from "./pages/RemixPage";
import ContextPage from "./pages/ContextPage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";
import MultiChatPage from "./pages/MultiChatPage";
import StickerStudioPage from "./pages/StickerStudioPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/remix" element={<RemixPage />} />
        <Route path="/context" element={<ContextPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/multi-chat" element={<MultiChatPage />} />
        <Route path="/sticker-studio" element={<StickerStudioPage />} />
      </Routes>
    </Router>
  );
}

export default App;

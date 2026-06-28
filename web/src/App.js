import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import LoadingScreen from "./components/LoadingScreen";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import RemixPage from "./pages/RemixPage";
import ContextPage from "./pages/ContextPage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";
import MultiChatPage from "./pages/MultiChatPage";
import ForumPage from "./pages/ForumPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  if (loading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Chargement...</div>;
  if (!user) return <Navigate to="/auth" />;
  return children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
              <Route path="/remix" element={<ProtectedRoute><RemixPage /></ProtectedRoute>} />
              <Route path="/context" element={<ProtectedRoute><ContextPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
              <Route path="/multi-chat" element={<ProtectedRoute><MultiChatPage /></ProtectedRoute>} />
              <Route path="/forum" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Routes>
          </Router>
        </UserProvider>
      )}
    </>
  );
}

export default App;

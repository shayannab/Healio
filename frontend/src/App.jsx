/**
 * Healio - Mental Health Dashboard
 * Main Application Entry Point
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import LandingPage from './pages/LandingPage';
import MoodDashboard from './components/dashboard/MoodDashboard';
import BreathBubble from './components/games/BreathBubble';
import WorryTimeCapsule from './components/games/WorryTimeCapsule';
import EnergyBattery from './components/games/EnergyBattery';
import GratitudeGarden from './components/games/GratitudeGarden';
import WalkActivity from './components/games/WalkActivity';
import GroundingExercise from './components/games/GroundingExercise';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<MoodDashboard />} />
          <Route path="/games/breath-bubble" element={<BreathBubble />} />
          <Route path="/games/worry-capsule" element={<WorryTimeCapsule />} />
          <Route path="/games/energy-battery" element={<EnergyBattery />} />
          <Route path="/games/gratitude-garden" element={<GratitudeGarden />} />
          <Route path="/games/walk" element={<WalkActivity />} />
          <Route path="/games/grounding" element={<GroundingExercise />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
    </AuthProvider >
  );
}

export default App;

/**
 * MoodFlow - Mental Health Dashboard
 * Main Application Entry Point
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import LandingPage from './pages/LandingPage';
import MoodDashboard from './pages/MoodDashboard';
import BreathBubble from './components/games/BreathBubble';
import WorryTimeCapsule from './components/games/WorryTimeCapsule';
import EnergyBattery from './components/games/EnergyBattery';
import GratitudeGarden from './components/games/GratitudeGarden';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<MoodDashboard />} />
        <Route path="/games/breath-bubble" element={<BreathBubble />} />
        <Route path="/games/worry-capsule" element={<WorryTimeCapsule />} />
        <Route path="/games/energy-battery" element={<EnergyBattery />} />
        <Route path="/games/gratitude-garden" element={<GratitudeGarden />} />
      </Routes>
    </Router>
  );
}

export default App;

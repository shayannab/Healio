/**
 * MoodFlow - Mental Health Dashboard
 * Main Application Entry Point
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import LandingPage from './pages/LandingPage';
import MoodDashboard from './pages/MoodDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<MoodDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

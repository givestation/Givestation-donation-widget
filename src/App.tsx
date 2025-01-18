import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DonationWidget from './components/DonationWidget';
import CustomizerPage from './pages/CustomizerPage';
import EmbedPage from './pages/EmbedPage';
import QRPage from './pages/QRPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomizerPage />} />
        <Route path="/embed" element={<EmbedPage />} />
        <Route path="/qr" element={<QRPage />} />
        <Route path="/donate" element={<DonationWidget project={null} />} />
      </Routes>
    </Router>
  );
}

export default App;
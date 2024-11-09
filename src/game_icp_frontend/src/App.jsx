import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameMenu from './GameMenu';
import Login from './components/Login.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GameMenu />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/AuthContext.jsx';
import GameMenu from './GameMenu';
import Login from './components/Login';
import Trail from "./components/exploretrail.jsx";
import Combat from './components/combat';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/" replace /> : <Login />
                } />
                <Route path="/" element={
                    <ProtectedRoute>
                        <GameMenu />
                    </ProtectedRoute>
                } />
                <Route path="/trail" element={
                    <ProtectedRoute>
                        <Trail />
                    </ProtectedRoute>
                } />
                <Route path="/combat" element={
                    <ProtectedRoute>
                        <Combat />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
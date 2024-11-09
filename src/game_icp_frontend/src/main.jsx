import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import GameMenu from './GameMenu.jsx'
import ConnectLogin from './components/Login.jsx'
import Trail from "./components/exploretrail.jsx"

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GameMenu />} />
                <Route path="/login" element={<ConnectLogin />} />
                <Route path="/Trail" element={<Trail/>} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
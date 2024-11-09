import React, { useState, useEffect } from 'react';
import batSprite from './assets/32x32-bat-sprite.png';
import stonebtn from './assets/brick2.png';
import caveBackground from './assets/menubg.gif';
import logo from './assets/LogoGame.png';
import { Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const handleConnectWallet = () => {
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-gray-400 border-b border-gray-200">
            {/* Logo */}
            <div className="flex items-center">
                <span className="text-xl font-bold">CDice</span>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <Settings size={20} />
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={handleConnectWallet}>
                    Login
                </button>
            </div>
        </nav>
    );
};

const StoneButton = ({ children, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            className="relative group"
        >
            <div className={`relative min-w-[200px] p-4 transform transition-transform duration-150 
                ${isHovered && !isPressed ? 'translate-x-[-2px] translate-y-[-2px]' : ''} 
                ${isPressed ? 'translate-x-[1px] translate-y-[1px]' : ''}`}
                 style={{
                     backgroundImage: `url(${stonebtn})`,
                     backgroundSize: '100% 100%',
                     backgroundRepeat: 'no-repeat',
                     imageRendering: 'pixelated'
                 }}>
                <span className="font-['Press_Start_2P'] block text-base tracking-wide text-center"
                      style={{
                          color: '#FFFFFF',
                          textShadow: `
                              -1px -1px 0 #6d4b2b,
                              1px -1px 0 #6d4b2b,
                              -1px 1px 0 #6d4b2b,
                              1px 1px 0 #6d4b2b,
                              0 2px 0 #4a3420`,
                          imageRendering: 'pixelated',
                          WebkitFontSmoothing: 'none',
                          MozOsxFontSmoothing: 'none'
                      }}>
                    {children}
                </span>
            </div>
        </button>
    );
};

const BatSprite = ({ initialPosition = 0, top = 100, speed = 2, size = 32, amplitude = 20, frequency = 0.02 }) => {
    const [frame, setFrame] = useState(0);
    const [position, setPosition] = useState(initialPosition);
    const [yOffset, setYOffset] = useState(0);

    const frames = [
        { x: 0, y: 32 },
        { x: 32, y: 32 },
        { x: 64, y: 32 },
        { x: 96, y: 32 },
    ];

    useEffect(() => {
        const frameInterval = setInterval(() => {
            setFrame((prevFrame) => (prevFrame + 1) % frames.length);
        }, 150);

        const positionInterval = setInterval(() => {
            setPosition((prevPosition) => {
                const newPosition = (prevPosition + speed) % (window.innerWidth + size);
                setYOffset(Math.sin(newPosition * frequency) * amplitude);
                return newPosition;
            });
        }, 50);

        return () => {
            clearInterval(frameInterval);
            clearInterval(positionInterval);
        };
    }, [frames.length, speed, size, amplitude, frequency]);

    return (
        <div
            style={{
                position: 'absolute',
                left: `${position}px`,
                top: `${top + yOffset}px`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundImage: `url(${batSprite})`,
                backgroundPosition: `-${frames[frame].x}px -${frames[frame].y}px`,
                backgroundSize: '128px',
                imageRendering: 'pixelated',
                zIndex: Math.floor(top),
                filter: `brightness(${0.7 + (top / 1000)})`
            }}
        />
    );
};

const GameMenu = () => {
    const navigate = useNavigate();
    const [isUIVisible, setIsUIVisible] = useState(true);
    const [frame, setFrame] = useState(0);

    const handleMenuClick = (item) => {
        switch(item) {
            case 'PLAY!':
                navigate('/Trail');
                break;
            case 'OPTIONS':
                // จัดการเมื่อกดปุ่ม OPTIONS
                break;
            case 'EXIT':
                // จัดการเมื่อกดปุ่ม EXIT
                break;
            default:
                break;
        }
    };

    const bats = [
        // กลุ่มค้างคาวที่บินใกล้เพดานถ้ำ
        { initialPosition: 0, top: 50, speed: 1.2, amplitude: 15, frequency: 0.015 },
        { initialPosition: 200, top: 80, speed: 1.5, amplitude: 10, frequency: 0.02 },
        { initialPosition: 400, top: 40, speed: 1.3, amplitude: 12, frequency: 0.018 },

        // กลุ่มค้างคาวที่บินกลางถ้ำ
        { initialPosition: 600, top: 150, speed: 2.2, amplitude: 25, frequency: 0.025 },
        { initialPosition: 800, top: 180, speed: 2.0, amplitude: 20, frequency: 0.022 },
        { initialPosition: 1000, top: 160, speed: 1.8, amplitude: 18, frequency: 0.02 },

        // กลุ่มค้างคาวที่บินด้านล่าง
        { initialPosition: 1200, top: 280, speed: 2.5, amplitude: 30, frequency: 0.03 },
        { initialPosition: 1400, top: 250, speed: 2.3, amplitude: 28, frequency: 0.028 }
    ];

    useEffect(() => {
        const frameInterval = setInterval(() => {
            setFrame(prev => (prev + 1) % 2);
        }, 500);
        return () => clearInterval(frameInterval);
    }, []);

    const menuItems = ['PLAY!', 'OPTIONS', 'EXIT'];

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Background Image */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${caveBackground})`,
                    filter: 'brightness(0.8)',
                }}
            />

            {/* Bats Layer */}
            <div className="absolute inset-0 overflow-hidden">
                {bats.map((bat, index) => (
                    <BatSprite
                        key={index}
                        initialPosition={bat.initialPosition}
                        top={bat.top}
                        speed={bat.speed}
                        amplitude={bat.amplitude}
                        frequency={bat.frequency}
                    />
                ))}
            </div>

            {/* Menu Content */}
            <div className="relative min-h-screen flex flex-col items-center justify-center">
                {isUIVisible && (
                    <>
                        <div className="mb-16">
                            <div className="p-8"
                                 style={{

                                     backgroundSize: '100% 100%',
                                     backgroundRepeat: 'no-repeat',
                                     imageRendering: 'pixelated'
                                 }}>
                                <div className="relative">
                                    <img
                                        src={logo}
                                        alt="CDICE"
                                        className="w-64 h-auto"
                                        style={{
                                            imageRendering: 'pixelated',
                                            WebkitFontSmoothing: 'none',
                                            MozOsxFontSmoothing: 'none'
                                        }}
                                    />

                                    <div className="flex justify-center gap-3 mt-6">
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <div/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {menuItems.map((item) => (
                                <div key={item}
                                     className="transform transition-all duration-150">
                                    <StoneButton onClick={() => handleMenuClick(item)}>
                                        {item}
                                    </StoneButton>
                                </div>
                            ))}
                        </div>

                        <div className="absolute bottom-8">
                            <StoneButton onClick={() => setIsUIVisible(false)}>
                                TOGGLE UI
                            </StoneButton>
                        </div>
                    </>
                )}

                {!isUIVisible && (
                    <StoneButton onClick={() => setIsUIVisible(true)}>
                        TOGGLE UI
                    </StoneButton>
                )}
            </div>
        </div>
    );
};

export default GameMenu;
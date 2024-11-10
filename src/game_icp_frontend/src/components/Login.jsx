import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { useAuth } from './AuthContext.jsx';
import React, { useState, useEffect } from 'react';
const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleWalletConnect = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await login();
            // ไม่ต้อง navigate ที่นี่ เพราะ useEffect จะจัดการให้
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to connect wallet. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 shadow-xl max-w-md w-full mx-4 relative">


                <div className="text-center mb-8">
                    <div className="bg-blue-100 p-3 rounded-full inline-flex mb-4">
                        <Wallet className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
                    <p className="text-gray-600">Choose your preferred wallet to connect to CDice</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleWalletConnect}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors duration-200 
                        ${isLoading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                >
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">🔗</span>
                        <span className="font-medium">ICP Connect</span>
                    </div>
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
                    ) : (
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    )}
                </button>

                <p className="text-sm text-gray-500 text-center mt-6">
                    By connecting a wallet, you agree to CDice's Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Login;
import React from 'react';
import { Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const walletOptions = [
        { name: 'ICP Connect', icon: '🔗' }
    ];

    const handleWalletConnect = (walletName) => {
        console.log(`Connecting to ${walletName}...`);
        // Add wallet connection logic here
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 shadow-xl max-w-md w-full mx-4 relative">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                    <span>←</span>
                    <span>Back</span>
                </button>

                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="bg-blue-100 p-3 rounded-full inline-flex mb-4">
                        <Wallet className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
                    <p className="text-gray-600">Choose your preferred wallet to connect to CDice</p>
                </div>

                {/* Wallet Options */}
                <div className="space-y-3">
                    {walletOptions.map((wallet) => (
                        <button
                            key={wallet.name}
                            onClick={() => handleWalletConnect(wallet.name)}
                            className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">{wallet.icon}</span>
                                <span className="font-medium">{wallet.name}</span>
                            </div>
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
                        </button>
                    ))}
                </div>

                {/* Terms and Conditions */}
                <p className="text-sm text-gray-500 text-center mt-6">
                    By connecting a ICP, you agree to CDice's Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Login;
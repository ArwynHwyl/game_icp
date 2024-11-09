import React from 'react';

const MerchantShop = ({ gold, setGold, setPlayerDeck, onClose }) => {
    const shopCards = [
        { id: 'shop1', type: 'fire', name: 'Inferno Blast', description: 'Deal massive damage based on fire dice', cost: 100 },
        { id: 'shop2', type: 'water', name: 'Tsunami Wave', description: 'Heal massively based on water dice', cost: 100 },
        { id: 'shop3', type: 'earth', name: 'Mountain Shield', description: 'Gain huge barrier based on earth dice', cost: 100 },
        { id: 'shop4', type: 'wind', name: 'Hurricane Draw', description: 'Draw many cards based on wind dice', cost: 100 },
    ];

    const handleBuyCard = (card) => {
        if (gold >= card.cost) {
            setGold(prev => prev - card.cost);
            setPlayerDeck(prev => [...prev, { ...card, id: Date.now() }]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full text-white">
                <div className="flex justify-between mb-6">
                    <h2 className="text-2xl">Secret Shop</h2>
                    <div className="text-yellow-400">Gold: {gold}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {shopCards.map((card) => (
                        <div key={card.id} className={`
                            p-4 rounded-lg border-2 
                            ${card.type === 'fire' ? 'border-red-500 bg-red-900' : ''}
                            ${card.type === 'water' ? 'border-blue-500 bg-blue-900' : ''}
                            ${card.type === 'earth' ? 'border-green-500 bg-green-900' : ''}
                            ${card.type === 'wind' ? 'border-purple-500 bg-purple-900' : ''}
                        `}>
                            <div className="font-bold mb-2">{card.name}</div>
                            <div className="text-sm mb-3">{card.description}</div>
                            <div className="flex justify-between items-center">
                                <div className="text-yellow-400">{card.cost} gold</div>
                                <button
                                    onClick={() => handleBuyCard(card)}
                                    disabled={gold < card.cost}
                                    className={`px-4 py-2 rounded-lg ${
                                        gold >= card.cost
                                            ? 'bg-yellow-600 hover:bg-yellow-500'
                                            : 'bg-gray-600 cursor-not-allowed'
                                    }`}
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                >
                    Close Shop
                </button>
            </div>
        </div>
    );
};

export default MerchantShop;
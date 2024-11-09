import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Combat from './Combat';
import MerchantShop from "./combat/MerchantShop.jsx";

const Trail = () => {
    const navigate = useNavigate();
    const [currentPosition, setCurrentPosition] = useState('start');
    const [visitedNodes, setVisitedNodes] = useState(['start']);
    const [playerHealth, setPlayerHealth] = useState(100);
    const [combatLog, setCombatLog] = useState('');
    const [showCombat, setShowCombat] = useState(false);
    const [currentEnemy, setCurrentEnemy] = useState(null);
    const [showRewardCard, setShowRewardCard] = useState({ show: false, card: null });
    const [availableNodes, setAvailableNodes] = useState([]);

    const [gold, setGold] = useState(0);
    const [showMerchant, setShowMerchant] = useState(false);

    // เพิ่ม state สำหรับระบบการ์ดและลูกเต๋า
    const [playerDeck, setPlayerDeck] = useState([]);
    const [diceCount, setDiceCount] = useState({
        fire: 1,
        water: 1,
        earth: 1,
        wind: 1
    });

    // การ์ดพื้นฐานเริ่มต้น 7 ใบ
    const initialCards = [
        { id: 1, type: 'fire', name: 'Fire Strike', description: 'Deal damage based on fire dice' },
        { id: 2, type: 'water', name: 'Healing Wave', description: 'Heal based on water dice' },
        { id: 3, type: 'earth', name: 'Barrier Field', description: 'Reduce next damage by 5 per earth dice' },
        { id: 4, type: 'wind', name: 'Gust Draw', description: 'Draw cards based on wind dice' },
        { id: 5, type: 'fire', name: 'Flame Burst', description: 'Deal damage based on fire dice' },
        { id: 6, type: 'water', name: 'Healing Spring', description: 'Heal based on water dice' },
        { id: 7, type: 'earth', name: 'Force Field', description: 'Reduce next damage by 5 per earth dice' },
    ];

    // ตั้งค่าเริ่มต้นสำหรับ deck
    useEffect(() => {
        setPlayerDeck(initialCards);
    }, []);

    // ฟังก์ชันสร้างการ์ดรางวัลแบบสุ่ม
    const generateRewardCard = () => {
        const cardTypes = ['fire', 'water', 'earth', 'wind'];
        const cardNames = {
            fire: ['Fire Strike', 'Flame Burst', 'Inferno', 'Blaze'],
            water: ['Healing Wave', 'Healing Spring', 'Ocean Surge', 'Ice Shield'],
            earth: ['Barrier Field', 'Force Field', 'Energy Shield', 'Power Guard'],
            wind: ['Gust Draw', 'Wind Rush', 'Storm Call', 'Tempest']
        };
        const cardDescriptions = {
            fire: 'Deal damage based on fire dice',
            water: 'Heal based on water dice',
            earth: 'Reduce next damage by 5 per earth dice',
            wind: 'Draw cards based on wind dice'
        };

        const randomType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        const randomName = cardNames[randomType][Math.floor(Math.random() * cardNames[randomType].length)];

        return {
            id: Date.now(),
            type: randomType,
            name: randomName,
            description: cardDescriptions[randomType]
        };
    };

    // กำหนดการ์ดที่จะสุ่มจากเหตุการณ์
    const eventCards = [
        {
            name: "Fire Dice",
            effect: "Get 1 fire dice",
            action: () => {
                setDiceCount(prev => ({...prev, fire: prev.fire + 1}));
                setCombatLog("Got 1 fire dice!");
            }
        },
        {
            name: "Water Dice",
            effect: "Get 1 water dice",
            action: () => {
                setDiceCount(prev => ({...prev, water: prev.water + 1}));
                setCombatLog("Got 1 water dice!");
            }
        },
        {
            name: "Earth Dice",
            effect: "Get 1 earth dice",
            action: () => {
                setDiceCount(prev => ({...prev, earth: prev.earth + 1}));
                setCombatLog("Got 1 earth dice!");
            }
        },
        {
            name: "Wind Dice",
            effect: "Get 1 wind dice",
            action: () => {
                setDiceCount(prev => ({...prev, wind: prev.wind + 1}));
                setCombatLog("Got 1 wind dice!");
            }
        }
    ];

    // กำหนดศัตรูในโหนด Combat
    const enemies = [
        { name: "Goblin", health: 30, damage: 10 },
        { name: "Skeleton", health: 40, damage: 15 },
        { name: "Mushroom", health: 50, damage: 20 }
    ];

    // โครงสร้างแผนที่ (เหมือนเดิม)
    const trailMap = {
        start: {
            position: { x: 200, y: 500 },
            next: ['n1'],
            type: 'start',
            description: 'Start your journey'
        },
        n1: {
            position: { x: 200, y: 450 },
            next: ['n2', 'n3', 'n4'],
            type: 'event',
            description: 'Draw a random card'
        },
        n2: {
            position: { x: 150, y: 400 },
            next: ['n5'],
            type: 'combat',
            description: 'Fight a random enemy',
            enemy: enemies[Math.floor(Math.random() * enemies.length)]
        },
        n3: {
            position: { x: 200, y: 400 },
            next: ['n6'],
            type: 'merchant', // เปลี่ยนจาก 'event' เป็น 'merchant'
            description: 'Secret Shop'
        },
        n4: {
            position: { x: 250, y: 400 },
            next: ['n7'],
            type: 'combat',
            description: 'Fight a random enemy',
            enemy: enemies[Math.floor(Math.random() * enemies.length)]
        },
        n5: {
            position: { x: 150, y: 350 },
            next: ['n8'],
            type: 'event',
            description: 'Draw a random card'
        },
        n6: {
            position: { x: 200, y: 350 },
            next: ['n8'],
            type: 'combat',
            description: 'Fight a random enemy',
            enemy: enemies[Math.floor(Math.random() * enemies.length)]
        },
        n7: {
            position: { x: 250, y: 350 },
            next: ['n8'],
            type: 'event',
            description: 'Draw a random card'
        },
        n8: {
            position: { x: 200, y: 300 },
            next: ['n9'],
            type: 'combat',
            description: 'Fight a random enemy',
            enemy: enemies[Math.floor(Math.random() * enemies.length)]
        },
        n9: {
            position: { x: 200, y: 250 },
            next: ['boss'],
            type: 'event',
            description: 'Draw a random card'
        },
        boss: {
            position: { x: 200, y: 200 },
            next: [],
            type: 'boss',
            description: 'Boss Fight: Dragon',
            enemy: { name: "Dragon", health: 200, damage: 30 }
        },
    };

    // จัดการเมื่อคลิกที่โหนด
    const handleNodeClick = (nodeId) => {
        if (trailMap[currentPosition].next.includes(nodeId) && !visitedNodes.includes(nodeId)) {
            const node = trailMap[nodeId];

            switch (node.type) {
                case 'event':
                    handleEvent();
                    setCurrentPosition(nodeId);
                    setVisitedNodes([...visitedNodes, nodeId]);
                    break;
                case 'merchant':
                    setShowMerchant(true);
                    setCurrentPosition(nodeId);
                    setVisitedNodes([...visitedNodes, nodeId]);
                    break;
                case 'combat':
                case 'boss':
                    setCurrentEnemy(node.enemy);
                    setShowCombat(true);
                    setCurrentPosition(nodeId);
                    setVisitedNodes([...visitedNodes, nodeId]);
                    break;
            }
        }
    };

    // จัดการเมื่อจบ Combat
    const handleCombatEnd = (result) => {
        setShowCombat(false);
        if (result.result === 'victory') {
            // คำนวณทองที่ได้จากการฆ่ามอน
            const goldEarned = Math.floor(currentEnemy.health * 0.5); // ทองที่ได้ = เลือดมอน/2
            const rewardCard = generateRewardCard();

            setGold(prev => prev + goldEarned);
            setCombatLog(`Victory! Earned ${goldEarned} gold! Received ${rewardCard.name}`);
            setPlayerDeck(prevDeck => [...prevDeck, rewardCard]);
            setShowRewardCard({
                show: true,
                card: rewardCard
            });

            setTimeout(() => {
                setShowRewardCard({
                    show: false,
                    card: null
                });
            }, 3000);
        } else {
            navigate('/');
        }
    };

    // ฟังก์ชันจัดการแต่ละประเภทโหนด
    const handleEvent = () => {
        const randomCard = eventCards[Math.floor(Math.random() * eventCards.length)];
        setCombatLog(`Event: ${randomCard.name} - ${randomCard.effect}`);
        randomCard.action();
    };

    // Component แสดงการ์ดรางวัล
    const RewardCardDisplay = ({ card }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded-lg transform scale-110 transition-transform duration-300
                ${card.type === 'fire' ? 'bg-red-700' : ''}
                ${card.type === 'water' ? 'bg-blue-700' : ''}
                ${card.type === 'earth' ? 'bg-green-700' : ''}
                ${card.type === 'wind' ? 'bg-purple-700' : ''}
            `}>
                <div className="text-white text-center">
                    <h3 className="text-2xl font-bold mb-2">New Card Received!</h3>
                    <div className="text-xl mb-1">{card.name}</div>
                    <div className="text-sm opacity-80">{card.description}</div>
                    <div className="mt-2 text-sm">Type: {card.type}</div>
                </div>
            </div>
        </div>
    );

    // Render path
    const renderPath = (start, end, visited) => {
        const startPos = trailMap[start].position;
        const endPos = trailMap[end].position;

        return (
            <line
                x1={startPos.x}
                y1={startPos.y}
                x2={endPos.x}
                y2={endPos.y}
                stroke={visited ? "#4CAF50" : "#ccc"}
                strokeWidth="2"
            />
        );
    };

    // สีตามประเภทโหนด
    const getNodeColor = (nodeId, isCurrentNode) => {
        if (isCurrentNode) return "#2196F3";
        if (visitedNodes.includes(nodeId)) return "#4CAF50";
        if (trailMap[currentPosition].next.includes(nodeId)) {
            const node = trailMap[nodeId];
            switch (node.type) {
                case 'combat': return "#FF4444";
                case 'event': return "#87CEEB";
                case 'merchant': return "#FFD700"; // สีทองสำหรับร้านค้า
                case 'boss': return "#FF0000";
                default: return "#FFC107";
            }
        }
        return "#ccc";
    };

    // แสดงข้อมูลลูกเต๋า
    const DiceInfo = () => (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="font-bold mb-2">Dice Count:</div>
            <div className="grid grid-cols-2 gap-2">
                <div>🔥 Fire: {diceCount.fire}</div>
                <div>💧 Water: {diceCount.water}</div>
                <div>🌍 Earth: {diceCount.earth}</div>
                <div>💨 Wind: {diceCount.wind}</div>
            </div>
        </div>
    );

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="relative w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
                {/* Player Status */}
                <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
                    <div className="mb-2">HP: {playerHealth}/100</div>
                    <div className="mb-2">{combatLog}</div>
                </div>

                {/* Gold Display & Node Info */}
                <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                    <div className="text-yellow-600 font-bold">Gold: {gold}</div>
                    <div className="font-bold mb-2">{trailMap[currentPosition].type.toUpperCase()}</div>
                    <div>{trailMap[currentPosition].description}</div>
                </div>

                {/* Dice Info */}
                <DiceInfo />

                <svg width="400" height="600" className="mx-auto">
                    {/* Draw paths */}
                    {Object.entries(trailMap).map(([nodeId, node]) =>
                        node.next.map(nextId => (
                            <React.Fragment key={`${nodeId}-${nextId}`}>
                                {renderPath(nodeId, nextId,
                                    visitedNodes.includes(nodeId) && visitedNodes.includes(nextId)
                                )}
                            </React.Fragment>
                        ))
                    )}

                    {/* Draw nodes */}
                    {Object.entries(trailMap).map(([nodeId, node]) => (
                        <g key={nodeId}>
                            <circle
                                cx={node.position.x}
                                cy={node.position.y}
                                r="15"
                                fill={getNodeColor(nodeId, currentPosition === nodeId)}
                                stroke={currentPosition === nodeId ? "#1976D2" : "none"}
                                strokeWidth="3"
                                className={
                                    trailMap[currentPosition].next.includes(nodeId) && !visitedNodes.includes(nodeId)
                                        ? "cursor-pointer hover:opacity-80"
                                        : "cursor-pointer"
                                }
                                onClick={() => handleNodeClick(nodeId)}
                            />
                            <text
                                x={node.position.x}
                                y={node.position.y + 5}
                                textAnchor="middle"
                                fill="white"
                                fontSize="12"
                            >
                                {nodeId === 'start' ? 'S' : nodeId === 'boss' ? 'B' : '•'}
                            </text>
                        </g>
                    ))}
                </svg>

            {/* Legend */}
            <div className="mt-4 text-center">
                <div className="flex justify-center gap-4">
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#2196F3] mr-2"></div>
                        <span>Current</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#4CAF50] mr-2"></div>
                        <span>Visited</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#87CEEB] mr-2"></div>
                        <span>Event Card</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#FF4444] mr-2"></div>
                        <span>Combat</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#FF0000] mr-2"></div>
                        <span>Boss</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-[#FFD700] mr-2"></div>
                        <span>Merchant</span>
                    </div>
                </div>
            </div>

            {/* Show Reward Card */}
            {showRewardCard.show && <RewardCardDisplay card={showRewardCard.card} />}

            {/* Combat Overlay */}
            {showCombat && (
            <Combat
                enemy={currentEnemy}
                onCombatEnd={handleCombatEnd}
                playerDeck={playerDeck}
                setPlayerDeck={setPlayerDeck}
                diceCount={diceCount}
            />
            )}

            {/* Merchant Shop */}
            {showMerchant && (
            <MerchantShop
                gold={gold}
                setGold={setGold}
                setPlayerDeck={setPlayerDeck}
                onClose={() => setShowMerchant(false)}
            />
            )}
        </div>
</div>
);
};

export default Trail;
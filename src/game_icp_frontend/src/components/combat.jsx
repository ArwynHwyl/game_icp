import React, { useState, useEffect } from 'react';
import skeleton from "../assets/skeleton.png";
import skeletonstill from "../assets/skeletonIdle.png";

const Combat = ({ enemy, onCombatEnd, playerDeck, setPlayerDeck, diceCount }) => {
    // สถานะผู้เล่น
    const [playerHealth, setPlayerHealth] = useState(100);
    const [enemyHealth, setEnemyHealth] = useState(enemy.health);
    const [playerBarrier, setPlayerBarrier] = useState(0);

    // ระบบการ์ด
    const [hand, setHand] = useState([]);
    const [graveyard, setGraveyard] = useState([]);
    const [drawPile, setDrawPile] = useState([...playerDeck]);

    // ระบบการต่อสู้
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedDice, setSelectedDice] = useState([]);
    const [diceResults, setDiceResults] = useState([]);
    const [isRolling, setIsRolling] = useState(false);
    const [showDiceUI, setShowDiceUI] = useState(false);
    const [combatLog, setCombatLog] = useState([]);

    // ค่าลูกเต๋าแต่ละด้าน
    const diceValues = {
        fire: [4, 6, 8, 10, 12, 20],  // ค่าดาเมจ
        water: [3, 4, 5, 6, 8, 10],   // ค่าฮีล
        earth: [1, 1, 2, 2, 3, 3],    // จำนวนครั้งที่บล็อค
        wind: [1, 1, 2, 2, 3, 3]      // จำนวนการ์ดที่จั่ว
    };
    // เพิ่ม state สำหรับ animation
    const [spriteFrame, setSpriteFrame] = useState(0);
    const [isAttacking, setIsAttacking] = useState(false);
    const totalFrames = 8; // จำนวน frame ทั้งหมดของท่าโจมตี
    const frameWidth = 150; // ความกว้างของแต่ละ frame
    const frameHeight = 150; // ความสูงของแต่ละ frame



    // Idle animation effect
    useEffect(() => {
        let animationFrame;

        if (isAttacking) {
            // Attack animation
            let currentFrame = 0;
            const animate = async () => {
                setSpriteFrame(currentFrame);

                // เพิ่ม delay ระหว่าง frame
                await new Promise(resolve => setTimeout(resolve, 150)); // ปรับตัวเลขนี้ให้ช้าลงได้ (milliseconds)

                currentFrame = (currentFrame + 1) % totalFrames;
                if (currentFrame < totalFrames - 1) {
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    setIsAttacking(false);
                }
            };
            animationFrame = requestAnimationFrame(animate);
        } else {
            // Idle animation (คงเดิม)
            const idleInterval = setInterval(() => {
                setSpriteFrame(prev => (prev + 1) % 4);
            }, 200);

            return () => clearInterval(idleInterval);
        }

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isAttacking]);

    // เริ่มต้นเทิร์น
    useEffect(() => {
        startTurn();
    }, []);

    // ตรวจสอบเมื่อ enemy ตาย
    useEffect(() => {
        if (enemyHealth <= 0) {
            addToCombatLog(`Victory! ${enemy.name} has been defeated!`);
            setTimeout(() => {
                onCombatEnd({
                    result: 'victory'
                });
            }, 1500);
        }
    }, [enemyHealth]);

    // ตรวจสอบเมื่อผู้เล่นตาย
    useEffect(() => {
        if (playerHealth <= 0) {
            addToCombatLog('Game Over...');
            setTimeout(() => {
                onCombatEnd({ result: 'defeat' });
            }, 1500);
        }
    }, [playerHealth]);

    // จั่วการ์ดจนเต็มมือ
    const drawToFull = () => {
        const cardsNeeded = 5 - hand.length;
        if (cardsNeeded <= 0) return;

        let newHand = [...hand];
        let newDraw = [...drawPile];
        let newGrave = [...graveyard];

        for (let i = 0; i < cardsNeeded; i++) {
            if (newDraw.length === 0) {
                if (newGrave.length === 0) break;
                newDraw = [...newGrave].sort(() => Math.random() - 0.5);
                newGrave = [];
                addToCombatLog("Reshuffling graveyard into draw pile...");
            }
            newHand.push(newDraw[0]);
            newDraw = newDraw.slice(1);
        }

        setHand(newHand);
        setDrawPile(newDraw);
        setGraveyard(newGrave);
    };

    // เริ่มต้นเทิร์น
    const startTurn = () => {
        setIsPlayerTurn(true);
        setPlayerBarrier(0);  // Reset Barrier เมื่อเริ่มเทิร์นใหม่
        drawToFull();
    };

    // จั่วการ์ดจากการใช้การ์ดลม
    const drawFromWind = (amount) => {
        let newHand = [...hand];
        let newDraw = [...drawPile];
        let newGrave = [...graveyard];

        for (let i = 0; i < amount; i++) {
            if (newDraw.length === 0) {
                if (newGrave.length === 0) break;
                newDraw = [...newGrave].sort(() => Math.random() - 0.5);
                newGrave = [];
                addToCombatLog("Reshuffling graveyard into draw pile...");
            }
            newHand.push(newDraw[0]);
            newDraw = newDraw.slice(1);
        }

        setHand(newHand);
        setDrawPile(newDraw);
        setGraveyard(newGrave);
    };

    // เพิ่ม log การต่อสู้
    const addToCombatLog = (message) => {
        setCombatLog(prev => [...prev, message]);
    };

    // เลือกการ์ดเพื่อเล่น
    const selectCard = (card) => {
        if (!isPlayerTurn) return;
        setSelectedCard(card);
        setSelectedDice([]);
        setShowDiceUI(true);
    };

    // เลือกลูกเต๋าเพื่อทอย
    const toggleDiceSelection = (diceType) => {
        if (selectedCard?.type !== diceType) return;

        if (selectedDice.includes(diceType)) {
            setSelectedDice(prev => prev.filter(d => d !== diceType));
        } else {
            setSelectedDice(prev => [...prev, diceType]);
        }
    };

    // ทอยลูกเต๋า
    const rollDice = async () => {
        if (selectedDice.length === 0) return;

        setIsRolling(true);

        // Animate dice roll
        for (let i = 0; i < 10; i++) {
            const tempResults = selectedDice.map(type => ({
                type,
                value: diceValues[type][Math.floor(Math.random() * diceValues[type].length)]
            }));
            setDiceResults(tempResults);
            await new Promise(r => setTimeout(r, 50));
        }

        // Final results
        const finalResults = selectedDice.map(type => ({
            type,
            value: diceValues[type][Math.floor(Math.random() * diceValues[type].length)]
        }));
        setDiceResults(finalResults);
        setIsRolling(false);

        // Apply card effect
        applyCardEffect(selectedCard, finalResults);
    };

    // ใช้การ์ด
    const applyCardEffect = (card, results) => {
        const totalValue = results.reduce((sum, result) => sum + result.value, 0);

        switch (card.type) {
            case 'fire':
                setEnemyHealth(prev => Math.max(0, prev - totalValue));
                addToCombatLog(`You deal ${totalValue} damage!`);
                break;

            case 'water':
                setPlayerHealth(prev => Math.min(100, prev + totalValue));
                addToCombatLog(`You heal for ${totalValue} HP!`);
                break;

            case 'earth':
                setPlayerBarrier(prev => prev + totalValue * 5);  // คูณ 5 เพื่อให้ได้ค่า barrier ที่มากขึ้น
                addToCombatLog(`You gain ${totalValue * 5} barrier!`);
                break;

            case 'wind':
                drawFromWind(totalValue);
                addToCombatLog(`You draw ${totalValue} card(s)!`);
                break;
        }

        // การ์ดที่ใช้แล้วไปสุสาน
        setHand(prev => prev.filter(c => c.id !== card.id));
        setGraveyard(prev => [...prev, card]);
        setSelectedCard(null);
        setShowDiceUI(false);
    };

    // จบเทิร์น
    const endTurn = () => {
        setIsPlayerTurn(false);
        enemyTurn();
    };

    // เทิร์นศัตรู
    const enemyTurn = () => {
        setIsAttacking(true); // เริ่ม animation
        const damage = enemy.damage;

        setTimeout(() => {
            if (playerBarrier > 0) {
                const reducedDamage = Math.max(0, damage - playerBarrier);
                setPlayerHealth(prev => Math.max(0, prev - reducedDamage));
                addToCombatLog(`Barrier reduces ${Math.min(damage, playerBarrier)} damage! You take ${reducedDamage} damage!`);
            } else {
                setPlayerHealth(prev => Math.max(0, prev - damage));
                addToCombatLog(`${enemy.name} deals ${damage} damage!`);
            }
        }, 500); // รอให้ animation เล่นก่อนคำนวณ damage

        setTimeout(() => {
            startTurn();
        }, 1500);
    };

    // UI สำหรับแสดงการทอยลูกเต๋า
    const DiceRollUI = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg max-w-xl w-full">
                <h2 className="text-xl text-white mb-4">Select dice to roll for {selectedCard?.name}</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {Array(diceCount[selectedCard?.type])
                        .fill(0)
                        .map((_, index) => (
                            <button
                                key={index}
                                onClick={() => toggleDiceSelection(selectedCard?.type)}
                                className={`p-4 rounded-lg ${
                                    selectedDice.includes(selectedCard?.type)
                                        ? 'bg-blue-600'
                                        : 'bg-gray-600'
                                }`}
                            >
                                {selectedCard?.type} Dice
                            </button>
                        ))}
                </div>

                {isRolling ? (
                    <div className="text-white text-center">
                        Rolling...
                        {diceResults.map((result, index) => (
                            <div key={index} className="text-2xl">
                                {result.type}: {result.value}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-between">
                        <button
                            onClick={() => setShowDiceUI(false)}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={rollDice}
                            disabled={selectedDice.length === 0}
                            className={`px-6 py-2 rounded-lg ${
                                selectedDice.length > 0
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-600 text-gray-400'
                            }`}
                        >
                            Roll
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-4xl text-white">
                {/* Status Bars */}
                <div className="flex justify-between mb-8">
                    <div className="w-1/3">
                        <div className="text-lg mb-2">Player HP: {playerHealth}/100</div>
                        <div className="h-4 bg-gray-700 rounded">
                            <div
                                className="h-full bg-green-500 rounded"
                                style={{ width: `${playerHealth}%` }}
                            />
                        </div>
                        {playerBarrier > 0 && (
                            <div className="text-yellow-300 mt-1">Barrier: {playerBarrier}</div>
                        )}
                    </div>
                    <div className="w-1/3">
                        <div className="text-lg mb-2">{enemy.name} HP: {enemyHealth}/{enemy.health}</div>
                        <div className="h-4 bg-gray-700 rounded">
                            <div
                                className="h-full bg-red-500 rounded"
                                style={{width: `${(enemyHealth / enemy.health) * 100}%`}}
                            />
                        </div>
                        {/* Enemy Container with Larger Pokemon-style Shadow */}
                        {enemy.name === "Skeleton" && (
                            <div className="relative mt-4" style={{ height: `${frameHeight}px` }}>
                                {/* Larger Pokemon-style Shadow Circle */}
                                <div
                                    className="absolute bottom-0 left-1/2"
                                    style={{
                                        width: '160px', // ปรับขนาดให้ใหญ่ขึ้น
                                        height: '40px',  // ปรับความสูงให้สมดุลกับความกว้าง
                                        background: 'radial-gradient(ellipse at center, rgba(144, 238, 144, 0.5) 0%, rgba(144, 238, 144, 0) 70%)',
                                        borderRadius: '50%',
                                        transform: 'translateX(-50%)',
                                        filter: 'blur(3px)', // เพิ่มความเบลอเล็กน้อยให้เข้ากับขนาดที่ใหญ่ขึ้น
                                        opacity: '0.7',
                                        zIndex: 1
                                    }}
                                />
                                {/* Skeleton Sprite */}
                                <div
                                    style={{
                                        width: `${frameWidth}px`,
                                        height: `${frameHeight}px`,
                                        backgroundImage: `url(${isAttacking ? skeleton : skeletonstill})`,
                                        backgroundPosition: `-${spriteFrame * frameWidth}px 0`,
                                        transformOrigin: 'center',
                                        transform: 'scale(2)',
                                        imageRendering: 'pixelated',
                                        margin: '0 auto',
                                        position: 'relative',
                                        zIndex: 2
                                    }}
                                />
                            </div>
                        )}
                    </div>

            </div>

            {/* Dice Count */}
            <div className="mb-4">
                <div className="text-lg mb-2">Available Dice:</div>
                <div className="flex gap-4">
                    {Object.entries(diceCount).map(([type, count]) => (
                        <div key={type} className="p-3 bg-gray-700 rounded-lg">
                            <div className="text-sm">{type}</div>
                            <div className="text-xl font-bold">{count}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Combat Log */}
            <div className="mb-8 h-32 overflow-y-auto bg-gray-900 p-4 rounded">
                {combatLog.map((log, index) => (
                    <div key={index} className="mb-1">{log}</div>
                ))}
            </div>

            {/* Hand */}
            <div className="flex gap-4 justify-center mb-4">
                {hand.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => selectCard(card)}
                        className={`
                                p-4 rounded cursor-pointer transition-transform
                                ${card === selectedCard ? 'scale-110' : ''}
                                ${card.type === 'fire' ? 'bg-red-700' : ''}
                                ${card.type === 'water' ? 'bg-blue-700' : ''}
                                ${card.type === 'earth' ? 'bg-green-700' : ''}
                                ${card.type === 'wind' ? 'bg-purple-700' : ''}
                            `}
                    >
                        <div className="font-bold mb-1">{card.name}</div>
                        <div className="text-sm">{card.description}</div>
                    </div>
                ))}
            </div>

            {/* Deck Info */}
            <div className="flex justify-between text-sm">
                <div>Draw Pile: {drawPile.length}</div>
                <div>Hand: {hand.length}/5</div>
                <div>Graveyard: {graveyard.length}</div>
            </div>

            {/* Turn Controls */}
            {isPlayerTurn && (
                <button
                    onClick={endTurn}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                    End Turn
                </button>
            )}
            {/* Dice Roll UI (ต่อ) */}
            {showDiceUI && <DiceRollUI/>}
        </div>
</div>
)
    ;
};

export default Combat;
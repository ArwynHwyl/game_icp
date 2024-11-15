import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import skeleton from "../assets/skeleton.png";
import skeletonstill from "../assets/skeletonIdle.png";
import skeletontakehit from "../assets/skeletonTakeHit.png";
import goblinattack from "../assets/goblinAttack.png";
import goblinidle from "../assets/goblinIdle.png";
import goblintakehit from "../assets/goblinTakeHit.png";
import mushroomidle from "../assets/mushroomIdle.png";
import mushroomatack from "../assets/mushroomAttack.png";
import mushroomtakehit from "../assets/mushroomTakeHit.png";
import bossIdle from "../assets/bossIdle.png";
import bossAttack from "../assets/bossAttack.png";
import bossTakeHit from "../assets/bossTakeHit.png";
import { game_icp_backend } from 'declarations/game_icp_backend';

// DiceRollUI Component
const DiceRollUI = ({
                        selectedCard,
                        selectedDice,
                        setSelectedDice,
                        diceResults,
                        setDiceResults,
                        setSelectedCard,
                        setShowDiceUI,
                        diceCount,
                        addToCombatLog,
                        diceValues,
                        applyCardEffect
                    }) => {
    const [hasRolled, setHasRolled] = useState(false);
    const [isWaitingForBackend, setIsWaitingForBackend] = useState(false);
    const [rollingDice, setRollingDice] = useState(new Set());
    const [animatedValues, setAnimatedValues] = useState({});

    // Effect for rolling animation
    useEffect(() => {
        let animationFrame;
        if (rollingDice.size > 0) {
            const animate = () => {
                setAnimatedValues(prev => {
                    const newValues = { ...prev };
                    rollingDice.forEach(diceIndex => {
                        if (!diceResults.find(r => r.diceIndex === diceIndex)) {
                            newValues[diceIndex] = Math.floor(Math.random() * 6) + 1;
                        }
                    });
                    return newValues;
                });
                animationFrame = requestAnimationFrame(animate);
            };
            animate();
        }
        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [rollingDice, diceResults]);

    const rollDice = async () => {
        if (selectedDice.length === 0) return;

        setIsWaitingForBackend(true);
        setRollingDice(new Set(selectedDice));
        setAnimatedValues({});

        try {
            console.log('Starting backend dice rolls...');

            const rollPromises = selectedDice.map(async (diceIndex) => {
                try {
                    const result = await game_icp_backend.random_number();
                    console.log(`Dice ${diceIndex + 1} backend result:`, result);

                    setRollingDice(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(diceIndex);
                        return newSet;
                    });

                    setAnimatedValues(prev => {
                        const newValues = { ...prev };
                        delete newValues[diceIndex];
                        return newValues;
                    });

                    const normalizedResult = (parseInt(result) % 6) + 1;
                    console.log(`Dice ${diceIndex + 1} normalized result:`, normalizedResult);

                    return {
                        type: selectedCard.type,
                        roll: normalizedResult,
                        diceIndex
                    };
                } catch (error) {
                    console.error(`Error rolling dice ${diceIndex + 1}:`, error);
                    throw error;
                }
            });

            const finalResults = await Promise.all(rollPromises);
            console.log('All dice rolls completed:', finalResults);

            setDiceResults(finalResults);
            setHasRolled(true);

        } catch (error) {
            console.error('Fatal error in dice rolling:', error);
            addToCombatLog('Error rolling dice. Please try again.');
            setSelectedDice([]);
        } finally {
            setIsWaitingForBackend(false);
            setRollingDice(new Set());
            setAnimatedValues({});
        }
    };

    const DiceDisplay = ({ index, isRolling, finalValue }) => {
        const currentValue = isRolling ? animatedValues[index] : finalValue;
        const result = diceResults.find(r => r.diceIndex === index);

        return (
            <div className={`p-4 rounded-lg ${
                result ? 'bg-blue-600' :
                    isRolling ? 'bg-yellow-600 animate-pulse' :
                        selectedDice.includes(index) ? 'bg-blue-600' : 'bg-gray-600'
            }`}>
                <div className="flex flex-col items-center justify-center gap-2">
                    <span>{selectedCard?.type} Dice {index + 1}</span>
                    {(isRolling || result) && (
                        <div className="text-2xl font-bold">
                            {result ? result.roll : currentValue}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg max-w-xl w-full">
                <h2 className="text-xl text-white mb-4">
                    Select dice to roll for {selectedCard?.name}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {Array(diceCount[selectedCard?.type])
                        .fill(0)
                        .map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (!hasRolled && !isWaitingForBackend) {
                                        if (selectedDice.includes(index)) {
                                            setSelectedDice(prev => prev.filter(d => d !== index));
                                        } else {
                                            setSelectedDice(prev => [...prev, index]);
                                        }
                                    }
                                }}
                                disabled={hasRolled || isWaitingForBackend}
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <DiceDisplay
                                    index={index}
                                    isRolling={rollingDice.has(index)}
                                    finalValue={diceResults.find(r => r.diceIndex === index)?.roll}
                                />
                            </button>
                        ))}
                </div>

                {!hasRolled && diceResults.length === 0 && (
                    <div className="flex justify-between">
                        <button
                            onClick={() => {
                                setSelectedCard(null);
                                setSelectedDice([]);
                                setDiceResults([]);
                                setShowDiceUI(false);
                            }}
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                            disabled={isWaitingForBackend}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={rollDice}
                            disabled={selectedDice.length === 0 || isWaitingForBackend}
                            className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                                selectedDice.length > 0 && !isWaitingForBackend
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-600 text-gray-400'
                            }`}
                        >
                            {isWaitingForBackend && <Loader2 className="animate-spin" size={16} />}
                            {isWaitingForBackend ? 'Rolling...' : 'Roll Dice'}
                        </button>
                    </div>
                )}

                {diceResults.length > 0 && (
                    <div className="text-center text-white">
                        <div className="border-t border-gray-600 pt-4 mt-4">
                            <div className={`text-xl ${
                                selectedCard?.type === 'fire' ? 'text-red-400' :
                                    selectedCard?.type === 'water' ? 'text-blue-400' :
                                        selectedCard?.type === 'earth' ? 'text-green-400' :
                                            'text-purple-400'
                            }`}>
                                {selectedCard?.type === 'fire' && `Total Damage: ${diceResults.reduce((sum, result) => sum + result.roll, 0)}`}
                                {selectedCard?.type === 'water' && `Total Heal: ${diceResults.reduce((sum, result) => sum + result.roll, 0)}`}
                                {selectedCard?.type === 'earth' && `Total Barrier: ${diceResults.reduce((sum, result) => sum + result.roll, 0)}`}
                                {selectedCard?.type === 'wind' && `Cards to Draw: ${diceResults.reduce((sum, result) =>
                                    sum + diceValues[result.type][result.roll - 1], 0)}`}
                            </div>
                            <button
                                onClick={() => applyCardEffect(selectedCard, diceResults)}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg mt-4"
                            >
                                Apply Effect
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Combat = ({ enemy, onCombatEnd, playerDeck, setPlayerDeck, diceCount }) => {
    const [playerHealth, setPlayerHealth] = useState(20);
    const [enemyHealth, setEnemyHealth] = useState(enemy.health);
    const [playerBarrier, setPlayerBarrier] = useState(0);
    const [hand, setHand] = useState([]);
    const [graveyard, setGraveyard] = useState([]);
    const [drawPile, setDrawPile] = useState([...playerDeck]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedDice, setSelectedDice] = useState([]);
    const [diceResults, setDiceResults] = useState([]);
    const [isRolling, setIsRolling] = useState(false);
    const [showDiceUI, setShowDiceUI] = useState(false);
    const [combatLog, setCombatLog] = useState([]);

    // Animation states
    const [spriteFrame, setSpriteFrame] = useState(0);
    const [currentAnimation, setCurrentAnimation] = useState('idle');
    const [isAnimating, setIsAnimating] = useState(false);

    // ค่าลูกเต๋าแต่ละด้าน
    const diceValues = {
        fire: [4, 6, 8, 10, 12, 20],  // ค่าดาเมจ
        water: [3, 4, 5, 6, 8, 10],   // ค่าฮีล
        earth: [1, 1, 2, 2, 3, 3],    // จำนวนครั้งที่บล็อค
        wind: [1, 1, 2, 2, 3, 3]      // จำนวนการ์ดที่จั่ว
    };

    // Animation configurations
    const animations = {
        boss: {
            idle: {
                spritesheet: bossIdle,
                frames: 4,
                frameWidth: 150,
                frameHeight: 150,
                duration: 200
            },
            attack: {
                spritesheet: bossAttack,
                frames: 8,
                frameWidth: 150,
                frameHeight: 150,
                duration: 150
            },
            takehit: {
                spritesheet: bossTakeHit,
                frames: 4,
                frameWidth: 150,
                frameHeight: 150,
                duration: 200
            }
        },
        goblin: {
            idle: {
                spritesheet: goblinidle,
                frames: 4,
                frameWidth: 150,
                frameHeight: 150,
                duration: 200
            },
            attack: {
                spritesheet: goblinattack,
                frames: 8,
                frameWidth: 150,
                frameHeight: 150,
                duration: 150
            },
            takehit: {
                spritesheet: goblintakehit,
                frames: 4,
                frameWidth: 150,
                frameHeight: 150,
                duration: 200
            }
        },
        skeleton: {
            idle: {
                spritesheet: skeletonstill,
                frames: 4,
                frameWidth: 150,
                frameHeight: 150,
                duration: 200
            },
            attack: {
                spritesheet: skeleton,
                frames: 8,
                frameWidth: 150,
                frameHeight: 150,
                duration: 150
            },
            takehit: {
                spritesheet: skeletontakehit,
                frames: 4,
                frameWidth: 150,
                frameHeight: 150,
                duration: 200
            }
        },
        mushroom: {
            idle: {
                spritesheet: mushroomidle,
                frames: 4,
                frameWidth: 150,
                frameHeight: 150,
                duration: 200
            },
            attack: {
                spritesheet: mushroomatack,
                frames: 8,
                frameWidth: 150,
                frameHeight: 150,
                duration: 150
            },
            takehit: {
                spritesheet: mushroomtakehit,
                frames: 4,
                frameWidth: 150,
                frameHeight: 150,
                duration: 200
            }
        }
    };

    // Animation effect
    useEffect(() => {
        let animationTimer;
        const currentEnemy = enemy.name.toLowerCase();
        const currentAnimConfig = animations[currentEnemy][currentAnimation];

        if (isAnimating && currentAnimConfig) {
            let frame = 0;
            const animate = () => {
                setSpriteFrame(frame);
                frame = (frame + 1) % currentAnimConfig.frames;

                if (currentAnimation !== 'idle' && frame === 0) {
                    setIsAnimating(false);
                    setCurrentAnimation('idle');
                } else {
                    animationTimer = setTimeout(animate, currentAnimConfig.duration);
                }
            };

            animate();
        } else if (!isAnimating && currentAnimation === 'idle') {
            const idleConfig = animations[currentEnemy].idle;
            animationTimer = setInterval(() => {
                setSpriteFrame(prev => (prev + 1) % idleConfig.frames);
            }, idleConfig.duration);}

        return () => {
            if (animationTimer) {
                clearTimeout(animationTimer);
            }
        };
    }, [isAnimating, currentAnimation, enemy.name]);

    // Function to play a specific animation
    const playAnimation = (animationName) => {
        setCurrentAnimation(animationName);
        setIsAnimating(true);
        setSpriteFrame(0);
    };

    // เริ่มต้นเทิร์น
    const startTurn = () => {
        setIsPlayerTurn(true);
        setPlayerBarrier(0);
        drawToFull();
    };

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

    // Combat log
    const addToCombatLog = (message) => {
        setCombatLog(prev => [...prev, message]);
    };

    // เลือกการ์ดเพื่อเล่น
    const selectCard = (card) => {
        if (!isPlayerTurn) return;
        setSelectedCard(card);
        setSelectedDice([]);
        setDiceResults([]);
        setShowDiceUI(true);
    };

    // Enemy turn logic
    const enemyTurn = () => {
        playAnimation('attack');
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
        }, animations[enemy.name.toLowerCase()].attack.duration * animations[enemy.name.toLowerCase()].attack.frames);

        setTimeout(() => {
            startTurn();
        }, (animations[enemy.name.toLowerCase()].attack.duration * animations[enemy.name.toLowerCase()].attack.frames) + 500);
    };

    // Card effect application
    const applyCardEffect = (card, results) => {
        switch (card.type) {
            case 'fire':
                const damage = results.reduce((sum, result) => sum + result.roll, 0);
                playAnimation('takehit');
                setTimeout(() => {
                    setEnemyHealth(prev => Math.max(0, prev - damage));
                }, animations[enemy.name.toLowerCase()].takehit.duration * 2);
                addToCombatLog(`You deal ${damage} damage!`);
                break;

            case 'water':
                const healing = results.reduce((sum, result) => sum + result.roll, 0);
                setPlayerHealth(prev => Math.min(20, prev + healing));
                addToCombatLog(`You heal for ${healing} HP!`);
                break;

            case 'earth':
                const barrier = results.reduce((sum, result) => sum + result.roll, 0);
                setPlayerBarrier(prev => prev + barrier);
                addToCombatLog(`You gain ${barrier} barrier!`);
                break;

            case 'wind':
                const cardsToDraw = results.reduce((sum, result) =>
                    sum + diceValues[result.type][result.roll - 1], 0
                );
                drawFromWind(cardsToDraw);
                addToCombatLog(`You draw ${cardsToDraw} card(s)!`);
                break;
        }

        setHand(prev => prev.filter(c => c.id !== card.id));
        setGraveyard(prev => [...prev, card]);
        setSelectedCard(null);
        setSelectedDice([]);
        setDiceResults([]);
        setShowDiceUI(false);
    };

    // Effect to start turn
    useEffect(() => {
        startTurn();
    }, []);

    // Health effects
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

    useEffect(() => {
        if (playerHealth <= 0) {
            addToCombatLog('Game Over...');
            setTimeout(() => {
                onCombatEnd({ result: 'defeat' });
            }, 1500);
        }
    }, [playerHealth]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-4xl text-white">
                {/* Status Bars */}
                <div className="flex justify-between mb-8">
                    <div className="w-1/3">
                        <div className="text-lg mb-2">Player HP: {playerHealth}/20</div>
                        <div className="h-4 bg-gray-700 rounded">
                            <div
                                className="h-full bg-green-500 rounded"
                                style={{width: `${(playerHealth / 20) * 100}%`}}
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

                        <div className="relative mt-4" style={{height: '150px'}}>
                            <div
                                className="absolute bottom-0 left-1/2"
                                style={{
                                    width: '160px',
                                    height: '40px',
                                    background: 'radial-gradient(ellipse at center, rgba(144, 238, 144, 0.5) 0%, rgba(144, 238, 144, 0) 70%)',
                                    borderRadius: '50%',
                                    transform: 'translateX(-50%)',
                                    filter: 'blur(3px)',
                                    opacity: '0.7',
                                    zIndex: 1
                                }}
                            />

                            <div
                                style={{
                                    width: `${animations[enemy.name.toLowerCase()][currentAnimation].frameWidth}px`,
                                    height: `${animations[enemy.name.toLowerCase()][currentAnimation].frameHeight}px`,
                                    backgroundImage: `url(${animations[enemy.name.toLowerCase()][currentAnimation].spritesheet})`,
                                    backgroundPosition: `-${spriteFrame * animations[enemy.name.toLowerCase()][currentAnimation].frameWidth}px 0`,
                                    transformOrigin: 'center',
                                    transform: 'scale(2)',
                                    imageRendering: 'pixelated',
                                    margin: '0 auto',
                                    position: 'relative',
                                    zIndex: 2
                                }}
                            />
                        </div>
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
                        onClick={() => {
                            setIsPlayerTurn(false);
                            enemyTurn();
                        }}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        End Turn
                    </button>
                )}

                {/* Dice Roll UI */}
                {showDiceUI && (
                    <DiceRollUI
                        selectedCard={selectedCard}
                        selectedDice={selectedDice}
                        setSelectedDice={setSelectedDice}
                        diceResults={diceResults}
                        setDiceResults={setDiceResults}
                        setSelectedCard={setSelectedCard}
                        setShowDiceUI={setShowDiceUI}
                        diceCount={diceCount}
                        addToCombatLog={addToCombatLog}
                        diceValues={diceValues}
                        applyCardEffect={applyCardEffect}
                    />
                )}
            </div>
        </div>
    );
};

export default Combat;
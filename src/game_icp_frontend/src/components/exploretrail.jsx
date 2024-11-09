import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Trail = () => {
    const navigate = useNavigate();
    // State for tracking current position and visited nodes
    const [currentPosition, setCurrentPosition] = useState('start');
    const [visitedNodes, setVisitedNodes] = useState(['start']);

    // Define the trail structure
    const trailMap = {
        start: { position: { x: 200, y: 500 }, next: ['n1'] },
        n1: { position: { x: 200, y: 450 }, next: ['n2', 'n3', 'n4'] },
        n2: { position: { x: 150, y: 400 }, next: ['n5'] },
        n3: { position: { x: 200, y: 400 }, next: ['n6'] },
        n4: { position: { x: 250, y: 400 }, next: ['n7'] },
        n5: { position: { x: 150, y: 350 }, next: ['n8'] },
        n6: { position: { x: 200, y: 350 }, next: ['n8'] },
        n7: { position: { x: 250, y: 350 }, next: ['n8'] },
        n8: { position: { x: 200, y: 300 }, next: ['n9'] },
        n9: { position: { x: 200, y: 250 }, next: ['boss'] },
        boss: { position: { x: 200, y: 200 }, next: [] },
    };

    // Handle node click
    const handleNodeClick = (nodeId) => {
        // Can only move to adjacent unvisited nodes
        if (trailMap[currentPosition].next.includes(nodeId) && !visitedNodes.includes(nodeId)) {
            setCurrentPosition(nodeId);
            setVisitedNodes([...visitedNodes, nodeId]);
        }
    };

    // Draw a line between two points
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

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="relative w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
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
                                fill={
                                    currentPosition === nodeId
                                        ? "#2196F3"  // Current node
                                        : visitedNodes.includes(nodeId)
                                            ? "#4CAF50"  // Visited node
                                            : trailMap[currentPosition].next.includes(nodeId)
                                                ? "#FFC107"  // Available node
                                                : "#ccc"     // Locked node
                                }
                                stroke={currentPosition === nodeId ? "#1976D2" : "none"}
                                strokeWidth="3"
                                className={`cursor-pointer ${
                                    trailMap[currentPosition].next.includes(nodeId) && !visitedNodes.includes(nodeId)
                                        ? "hover:opacity-80"
                                        : ""
                                }`}
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
                            <div className="w-4 h-4 rounded-full bg-[#FFC107] mr-2"></div>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-[#ccc] mr-2"></div>
                            <span>Locked</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trail;
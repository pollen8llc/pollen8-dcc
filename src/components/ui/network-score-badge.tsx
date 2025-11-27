import React, { useState, useEffect } from "react";

interface NetworkScoreBadgeProps {
  score: number;
}

// Network Plexus Animation Component (just the animation)
export const NetworkPlexus: React.FC = () => {
  // Node positions - 8 nodes in a square (corners + midpoints)
  const nodes = [
    { id: 0, cx: 4, cy: 4 },      // Top-left corner
    { id: 1, cx: 12, cy: 4 },     // Top-middle
    { id: 2, cx: 20, cy: 4 },     // Top-right corner
    { id: 3, cx: 20, cy: 12 },    // Right-middle
    { id: 4, cx: 20, cy: 20 },    // Bottom-right corner
    { id: 5, cx: 12, cy: 20 },    // Bottom-middle
    { id: 6, cx: 4, cy: 20 },     // Bottom-left corner
    { id: 7, cx: 4, cy: 12 },     // Left-middle
  ];

  // State for active node (flashing)
  const [activeNode, setActiveNode] = useState(0);
  
  // State for active edges
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());

  // Sequential node flashing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % nodes.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Random edge animations
  useEffect(() => {
    const interval = setInterval(() => {
      const from = Math.floor(Math.random() * nodes.length);
      const to = Math.floor(Math.random() * nodes.length);
      if (from !== to) {
        const edgeKey = `${from}-${to}`;
        setActiveEdges((prev) => {
          const newSet = new Set(prev);
          newSet.add(edgeKey);
          return newSet;
        });
        
        // Remove edge after animation
        setTimeout(() => {
          setActiveEdges((prev) => {
            const newSet = new Set(prev);
            newSet.delete(edgeKey);
            return newSet;
          });
        }, 600);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative w-8 h-8 flex-shrink-0">
      <svg viewBox="0 0 24 24" className="w-full h-full">
        {/* Static connection lines (square perimeter) */}
        <line x1="4" y1="4" x2="12" y2="4" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <line x1="12" y1="4" x2="20" y2="4" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <line x1="20" y1="4" x2="20" y2="12" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <line x1="20" y1="12" x2="20" y2="20" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <line x1="20" y1="20" x2="12" y2="20" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <line x1="12" y1="20" x2="4" y2="20" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <line x1="4" y1="20" x2="4" y2="12" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <line x1="4" y1="12" x2="4" y2="4" stroke="white" strokeWidth="0.5" opacity="0.2" />
        
        {/* Animated traffic edges */}
        {Array.from(activeEdges).map((edgeKey) => {
          const [from, to] = edgeKey.split('-').map(Number);
          const fromNode = nodes[from];
          const toNode = nodes[to];
          return (
            <line
              key={edgeKey}
              x1={fromNode.cx}
              y1={fromNode.cy}
              x2={toNode.cx}
              y2={toNode.cy}
              stroke="white"
              strokeWidth="1"
              opacity="0.9"
              className="animate-pulse"
            />
          );
        })}
        
        {/* Network nodes with sequential flashing */}
        {nodes.map((node, index) => (
          <circle
            key={node.id}
            cx={node.cx}
            cy={node.cy}
            r={activeNode === index ? "1.5" : "1.2"}
            fill="white"
            opacity={activeNode === index ? "1" : "0.7"}
            className="transition-all duration-300"
          />
        ))}
      </svg>
    </div>
  );
};

// Network Score Number Display Component (just the numbers)
export const NetworkScoreNumber: React.FC<NetworkScoreBadgeProps> = ({ score }) => {
  const scoreStr = score.toString();
  const formattedScore = scoreStr.padEnd(8, "0");
  
  return (
    <div className="flex items-center gap-0.5 font-mono text-base leading-none">
      {formattedScore.split("").map((digit, index) => {
        const isActive = index < scoreStr.length;
        return (
          <span
            key={index}
            className={`transition-opacity duration-300 ${
              isActive 
                ? "text-foreground opacity-100" 
                : "text-muted-foreground/30 opacity-40"
            }`}
          >
            {digit}
          </span>
        );
      })}
    </div>
  );
};

// Combined component (for backward compatibility)
export const NetworkScoreBadge: React.FC<NetworkScoreBadgeProps> = ({ score }) => {
  return (
    <div className="inline-flex items-center gap-3 h-10 w-fit self-center sm:self-start">
      <NetworkPlexus />
      <NetworkScoreNumber score={score} />
    </div>
  );
};

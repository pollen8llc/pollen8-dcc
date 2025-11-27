import React from "react";
import { Badge } from "@/components/ui/badge";

interface NetworkScoreBadgeProps {
  score: number;
}

export const NetworkScoreBadge: React.FC<NetworkScoreBadgeProps> = ({ score }) => {
  // Format score to 8 digits with leading zeros
  const formattedScore = score.toString().padStart(8, "0");
  
  return (
    <Badge 
      variant="secondary" 
      className="flex items-center gap-3 px-4 py-2 bg-card/50 backdrop-blur-sm border-primary/20"
    >
      {/* Hexagon Plexus Animation */}
      <div className="relative w-8 h-8">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 0 4px hsl(var(--primary)/0.5))" }}
        >
          {/* Animated hexagons */}
          <g className="animate-pulse">
            {/* Center hexagon */}
            <polygon
              points="50,15 65,25 65,45 50,55 35,45 35,25"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              className="animate-[scale-in_2s_ease-in-out_infinite]"
            />
            {/* Top hexagon */}
            <polygon
              points="50,5 60,10 60,20 50,25 40,20 40,10"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              opacity="0.6"
              className="animate-[fade-in_2s_ease-in-out_infinite_0.3s]"
            />
            {/* Bottom hexagon */}
            <polygon
              points="50,55 60,60 60,70 50,75 40,70 40,60"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              opacity="0.6"
              className="animate-[fade-in_2s_ease-in-out_infinite_0.6s]"
            />
            {/* Left hexagon */}
            <polygon
              points="30,30 35,27 40,30 40,36 35,39 30,36"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              opacity="0.4"
              className="animate-[fade-in_2s_ease-in-out_infinite_0.9s]"
            />
            {/* Right hexagon */}
            <polygon
              points="60,30 65,27 70,30 70,36 65,39 60,36"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              opacity="0.4"
              className="animate-[fade-in_2s_ease-in-out_infinite_1.2s]"
            />
          </g>
          {/* Connection lines (plexus effect) */}
          <g opacity="0.3">
            <line x1="50" y1="25" x2="50" y2="55" stroke="hsl(var(--primary))" strokeWidth="1" />
            <line x1="35" y1="25" x2="30" y2="30" stroke="hsl(var(--primary))" strokeWidth="1" />
            <line x1="65" y1="25" x2="70" y2="30" stroke="hsl(var(--primary))" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* 8-Digit Counter Display */}
      <div className="flex items-center gap-0.5 font-mono text-lg leading-none">
        {formattedScore.split("").map((digit, index) => {
          const isActive = index >= 8 - score.toString().length;
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
    </Badge>
  );
};

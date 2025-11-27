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
      className="flex items-center gap-1.5 px-2 py-0.5 bg-card/50 backdrop-blur-sm border-primary/20 h-6"
    >
      {/* Tiny 6-Point Plexus Animation */}
      <div className="relative w-3 h-3">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          {/* 6 connection points in a network */}
          <circle cx="12" cy="4" r="1" fill="white" opacity="0.8" className="animate-pulse" />
          <circle cx="20" cy="8" r="1" fill="white" opacity="0.6" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
          <circle cx="20" cy="16" r="1" fill="white" opacity="0.6" className="animate-pulse" style={{ animationDelay: "0.4s" }} />
          <circle cx="12" cy="20" r="1" fill="white" opacity="0.8" className="animate-pulse" style={{ animationDelay: "0.6s" }} />
          <circle cx="4" cy="16" r="1" fill="white" opacity="0.6" className="animate-pulse" style={{ animationDelay: "0.8s" }} />
          <circle cx="4" cy="8" r="1" fill="white" opacity="0.6" className="animate-pulse" style={{ animationDelay: "1s" }} />
          
          {/* Connection lines */}
          <line x1="12" y1="4" x2="20" y2="8" stroke="white" strokeWidth="0.5" opacity="0.3" />
          <line x1="20" y1="8" x2="20" y2="16" stroke="white" strokeWidth="0.5" opacity="0.3" />
          <line x1="20" y1="16" x2="12" y2="20" stroke="white" strokeWidth="0.5" opacity="0.3" />
          <line x1="12" y1="20" x2="4" y2="16" stroke="white" strokeWidth="0.5" opacity="0.3" />
          <line x1="4" y1="16" x2="4" y2="8" stroke="white" strokeWidth="0.5" opacity="0.3" />
          <line x1="4" y1="8" x2="12" y2="4" stroke="white" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>

      {/* 8-Digit Counter Display */}
      <div className="flex items-center font-mono text-xs leading-none tracking-tighter">
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

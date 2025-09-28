import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SOLAR_SYSTEMS, type SolarSystemConfig } from '@/data/solarSystemsConfig';

interface SolarSystemProps {
  systemId: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const SolarSystem: React.FC<SolarSystemProps> = ({ 
  systemId, 
  size = 56, 
  className = "",
  onClick 
}) => {
  const config = SOLAR_SYSTEMS[systemId];
  
  if (!config) {
    console.warn(`Solar system ${systemId} not found`);
    return null;
  }

  const uniqueId = `solar-${systemId}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    // Generate unique keyframes for this system's planets
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    
    let keyframes = '';
    config.planets.forEach((planet, index) => {
      const animationName = `orbit-${uniqueId}-${index}`;
      keyframes += `
        @keyframes ${animationName} {
          from { transform: rotate(0deg) translateX(${planet.distance}px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(${planet.distance}px) rotate(-360deg); }
        }
      `;
    });
    
    styleSheet.innerHTML = keyframes;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [config, uniqueId]);

  // Helper function to create enhanced sun gradient and glow
  const getSunStyle = (color: string, size: number) => {
    return {
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, ${color}dd 40%, ${color}aa 70%, ${color}77 100%)`,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      boxShadow: `
        0 0 ${size * 0.5}px ${color}ff,
        0 0 ${size * 1}px ${color}cc,
        0 0 ${size * 1.5}px ${color}88,
        inset 0 0 ${size * 0.3}px ${color}ff
      `,
      filter: 'brightness(1.3)',
      animation: 'pulse 2s ease-in-out infinite alternate'
    };
  };

  // Helper function to create enhanced planet gradient and glow
  const getPlanetStyle = (color: string, size: number) => {
    return {
      width: size,
      height: size,
      background: `radial-gradient(circle at 30% 30%, ${color}ff 0%, ${color}dd 50%, ${color}99 100%)`,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      boxShadow: `
        0 0 ${size * 1.5}px ${color}dd,
        0 0 ${size * 2.5}px ${color}77,
        inset 0 0 ${size * 0.4}px ${color}ff
      `,
      filter: 'brightness(1.2)',
      animation: 'pulse 3s ease-in-out infinite alternate'
    };
  };

  return (
    <div 
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:scale-110",
        className
      )}
      style={{
        width: size,
        height: size,
        padding: '12px',
        borderRadius: '50%',
        border: '2px solid',
        borderColor: config.avatarStyle.borderColor,
        background: config.avatarStyle.background,
        boxShadow: config.avatarStyle.boxShadow,
        backdropFilter: 'blur(12px)',
        overflow: 'hidden'
      }}
      onClick={onClick}
    >
      {/* Orbital paths */}
      {config.planets.map((planet, index) => (
        <div
          key={`orbit-${index}`}
          className="absolute top-1/2 left-1/2 rounded-full border border-white/10"
          style={{
            width: planet.distance * 2,
            height: planet.distance * 2,
            marginLeft: -planet.distance,
            marginTop: -planet.distance,
          }}
        />
      ))}
      
      {/* Sun */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full z-20"
        style={getSunStyle(config.sunColor, config.sunSize)}
      />
      
      {/* Planets */}
      {config.planets.map((planet, index) => {
        const animationName = `orbit-${uniqueId}-${index}`;
        return (
          <div
            key={`planet-${index}`}
            className="absolute top-1/2 left-1/2 z-10"
            style={{
              animation: `${animationName} ${planet.speed}s linear infinite`,
              animationDelay: `${planet.delay}s`,
            }}
          >
            <div
              className="rounded-full"
              style={getPlanetStyle(planet.color, planet.size)}
            />
          </div>
        );
      })}
    </div>
  );
};
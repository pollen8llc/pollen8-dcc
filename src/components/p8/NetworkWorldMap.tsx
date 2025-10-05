import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";

// Inline SVG Ring Chart Component
const RingChart = () => {
  const totalContacts = 1247;
  const activeConnections = 842;
  const activePercentage = (activeConnections / totalContacts) * 100;
  
  const size = 96;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const activeStrokeDashoffset = circumference - (activePercentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      {/* Glassmorphic background circle */}
      <div className="absolute inset-0 rounded-full bg-background/50 backdrop-blur-sm border border-primary/20" />
      
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Inactive ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={0.3}
        />
        
        {/* Active ring (teal with glow) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#00eada"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={activeStrokeDashoffset}
          className="drop-shadow-[0_0_8px_rgba(0,234,218,0.5)]"
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out',
          }}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-foreground">
          {Math.round(activePercentage)}%
        </span>
      </div>
    </div>
  );
};

const NetworkWorldMap = () => {
  const plexusCanvasRef = useRef<HTMLCanvasElement>(null);

  // Plexus animation effect
  useEffect(() => {
    const canvas = plexusCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle system for plexus - slower and brighter
    const particlesArray: Particle[] = [];
    const numberOfParticles = 60;
    const maxDistance = 140;

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = Math.random() * 0.15 - 0.075; // Slower movement
        this.directionY = Math.random() * 0.15 - 0.075; // Slower movement
        this.size = Math.random() * 2.5 + 1;
      }

      update() {
        if (this.x < 0 || this.x > canvas.width) {
          this.directionX = -this.directionX;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 234, 218, 0.25)"; // Brighter particles
        ctx.fill();
      }
    }

    const init = () => {
      particlesArray.length = 0;
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const connect = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 234, 218, ${opacity * 0.3})`; // Brighter lines
            ctx.lineWidth = 1;
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connect();
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);


  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30">
      {/* Plexus Background */}
      <canvas
        ref={plexusCanvasRef}
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8">
        <div className="flex flex-row items-center gap-6 lg:gap-8">
          {/* Left: Ring Chart (same size as avatar - 96px) */}
          <div className="shrink-0">
            <RingChart />
          </div>

          {/* Center: Title and Badges */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-2">Network</h2>
            
            {/* Connection badges */}
            <div className="flex flex-wrap gap-1.5">
              <Badge
                className="text-xs bg-[#00eada]/10 text-[#00eada] border border-[#00eada]/30 hover:bg-[#00eada]/20 transition-colors"
              >
                Strong Ties
              </Badge>
              <Badge
                className="text-xs bg-[#00eada]/10 text-[#00eada] border border-[#00eada]/30 hover:bg-[#00eada]/20 transition-colors"
              >
                Weak Ties
              </Badge>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="shrink-0 text-right">
            <div className="text-2xl font-bold text-[#00eada] mb-1">
              842
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Active
            </div>
            <div className="text-xl font-semibold text-foreground">
              1,247
            </div>
            <div className="text-sm text-muted-foreground">
              Total
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NetworkWorldMap;

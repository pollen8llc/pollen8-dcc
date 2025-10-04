import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef } from "react";

const NetworkWorldMap = () => {
  const plexusCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

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

    // Particle system for plexus
    const particlesArray: Particle[] = [];
    const numberOfParticles = 50;
    const maxDistance = 120;

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.directionX = Math.random() * 0.3 - 0.15;
        this.directionY = Math.random() * 0.3 - 0.15;
        this.size = Math.random() * 2 + 1;
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
        ctx.fillStyle = "rgba(0, 234, 218, 0.1)";
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
            ctx.strokeStyle = `rgba(0, 234, 218, ${opacity * 0.15})`;
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

  // Ring chart effect
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      draw();
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get primary color from CSS variable
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();

      // Draw centered glowing ring chart
      const centerX = width / 2;
      const centerY = height / 2;
      const outerRadius = Math.min(width, height) * 0.15;
      const innerRadius = outerRadius * 0.6;

      // Network data
      const totalContacts = 1247;
      const activeConnections = 842;
      const activePercentage = (activeConnections / totalContacts) * 100;
      const activeAngle = (activePercentage / 100) * Math.PI * 2;

      // Draw glow effect
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        innerRadius,
        centerX,
        centerY,
        outerRadius + 30
      );
      gradient.addColorStop(0, `hsl(${primaryColor} / 0)`);
      gradient.addColorStop(0.5, `hsl(${primaryColor} / 0.2)`);
      gradient.addColorStop(1, `hsl(${primaryColor} / 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius + 30, 0, Math.PI * 2);
      ctx.fill();

      // Draw inactive portion (background ring)
      ctx.strokeStyle = `hsl(${primaryColor} / 0.2)`;
      ctx.lineWidth = outerRadius - innerRadius;
      ctx.beginPath();
      ctx.arc(centerX, centerY, (outerRadius + innerRadius) / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Draw active portion (glowing ring)
      const activeGradient = ctx.createLinearGradient(
        centerX - outerRadius,
        centerY,
        centerX + outerRadius,
        centerY
      );
      activeGradient.addColorStop(0, `hsl(${primaryColor})`);
      activeGradient.addColorStop(1, `hsl(${primaryColor} / 0.7)`);
      
      ctx.strokeStyle = activeGradient;
      ctx.lineWidth = outerRadius - innerRadius;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        (outerRadius + innerRadius) / 2,
        -Math.PI / 2,
        -Math.PI / 2 + activeAngle
      );
      ctx.stroke();

      // Draw center text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Percentage
      ctx.fillStyle = `hsl(${primaryColor})`;
      ctx.font = `bold ${outerRadius * 0.35}px sans-serif`;
      ctx.fillText(`${Math.round(activePercentage)}%`, centerX, centerY - outerRadius * 0.15);
      
      // Label
      ctx.fillStyle = `hsl(${primaryColor} / 0.7)`;
      ctx.font = `${outerRadius * 0.15}px sans-serif`;
      ctx.fillText("Active", centerX, centerY + outerRadius * 0.2);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl">
          <CardContent className="p-0">
            <div className="relative min-h-[300px] lg:min-h-[350px]">
              {/* Plexus Background */}
              <canvas
                ref={plexusCanvasRef}
                className="absolute inset-0 w-full h-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, hsl(var(--background)) 0%, hsl(var(--background)) 100%)",
                }}
              />

              {/* Ring Chart Overlay */}
              <canvas
                ref={chartCanvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ pointerEvents: "none" }}
              />

              {/* Legend */}
              <div className="absolute bottom-6 right-6 bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-primary/20 z-10">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-foreground font-medium">
                      Active Connections: 842
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                    <span className="text-muted-foreground">
                      Total Contacts: 1,247
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Glowing Sliver */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-[2px] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[4px] opacity-40" />
      </div>
    </div>
  );
};

export default NetworkWorldMap;

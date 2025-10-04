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

  // Ring chart effect with slow flashing
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let flashProgress = 0;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Position ring chart on the left side at 96px from left, vertically centered
      const centerX = 96;
      const centerY = height / 2;
      const size = 96; // Same as avatar size
      const outerRadius = size / 2;
      const innerRadius = outerRadius * 0.75; // Thinner ring for minimal look

      // Network data
      const totalContacts = 1247;
      const activeConnections = 842;
      const activePercentage = (activeConnections / totalContacts) * 100;
      const activeAngle = (activePercentage / 100) * Math.PI * 2;

      // Slow flashing effect (3 second cycle)
      flashProgress += 0.005;
      const flashIntensity = (Math.sin(flashProgress) + 1) / 2; // 0 to 1

      // Glassmorphic background
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius + 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw inactive portion (blue) - smaller side
      const inactiveAngle = Math.PI * 2 - activeAngle;
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"; // Blue
      ctx.lineWidth = outerRadius - innerRadius;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        (outerRadius + innerRadius) / 2,
        -Math.PI / 2 + activeAngle,
        -Math.PI / 2 + Math.PI * 2
      );
      ctx.stroke();

      // Draw active portion (teal) - bigger side with flash
      const flashOpacity = 0.6 + flashIntensity * 0.4; // 0.6 to 1.0
      ctx.strokeStyle = `rgba(20, 184, 166, ${flashOpacity})`; // Teal with flashing
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

      // Subtle glow on active portion during flash
      if (flashIntensity > 0.5) {
        ctx.shadowBlur = 15 * flashIntensity;
        ctx.shadowColor = "rgba(20, 184, 166, 0.5)";
        ctx.strokeStyle = `rgba(20, 184, 166, ${flashIntensity * 0.3})`;
        ctx.lineWidth = outerRadius - innerRadius + 2;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          (outerRadius + innerRadius) / 2,
          -Math.PI / 2,
          -Math.PI / 2 + activeAngle
        );
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw center text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Percentage
      ctx.fillStyle = "rgba(20, 184, 166, 0.9)";
      ctx.font = `bold ${size * 0.2}px sans-serif`;
      ctx.fillText(`${Math.round(activePercentage)}%`, centerX, centerY - size * 0.08);
      
      // Label
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = `${size * 0.1}px sans-serif`;
      ctx.fillText("Active", centerX, centerY + size * 0.1);

      animationFrame = requestAnimationFrame(draw);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    draw();

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl">
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-r from-background via-background/50 to-background p-6 lg:p-8">
              {/* Plexus Background */}
              <canvas
                ref={plexusCanvasRef}
                className="absolute inset-0 w-full h-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, hsl(var(--background)) 0%, hsl(var(--background)) 100%)",
                }}
              />

              {/* Ring Chart Canvas */}
              <canvas
                ref={chartCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Content Layout */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
                {/* Ring Chart Space (left) */}
                <div className="flex-shrink-0 w-24 h-24" />

                {/* Network Info (center-left) */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-3">
                    Network
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Social Connection Analysis
                  </p>
                </div>

                {/* Stats (right) */}
                <div className="flex-shrink-0 bg-background/60 backdrop-blur-sm rounded-lg p-4 lg:p-6 border border-primary/20">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0"></div>
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">
                          Active Connections
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          842
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary/20 flex-shrink-0"></div>
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">
                          Total Contacts
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          1,247
                        </div>
                      </div>
                    </div>
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

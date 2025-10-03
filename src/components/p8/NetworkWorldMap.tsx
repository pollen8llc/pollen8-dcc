import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";

const NetworkWorldMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
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

      // Draw dot matrix world map (simplified continents)
      const dotSpacing = 12;
      const continents = [
        // North America
        { x: 0.15, y: 0.25, w: 0.15, h: 0.25 },
        // South America
        { x: 0.18, y: 0.5, w: 0.1, h: 0.2 },
        // Europe
        { x: 0.45, y: 0.2, w: 0.1, h: 0.15 },
        // Africa
        { x: 0.45, y: 0.35, w: 0.12, h: 0.25 },
        // Asia
        { x: 0.6, y: 0.15, w: 0.25, h: 0.35 },
        // Australia
        { x: 0.75, y: 0.6, w: 0.1, h: 0.1 },
      ];

      // Get primary color from CSS variable
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();

      // Draw dots for continents
      ctx.fillStyle = `hsl(${primaryColor} / 0.3)`;
      for (let x = 0; x < width; x += dotSpacing) {
        for (let y = 0; y < height; y += dotSpacing) {
          const normalizedX = x / width;
          const normalizedY = y / height;

          // Check if point is in any continent
          const inContinent = continents.some(
            (c) =>
              normalizedX >= c.x &&
              normalizedX <= c.x + c.w &&
              normalizedY >= c.y &&
              normalizedY <= c.y + c.h
          );

          if (inContinent) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

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
    <Card className="w-full bg-background/40 backdrop-blur-xl border-primary/20 overflow-hidden relative">
      <canvas
        ref={canvasRef}
        className="w-full h-[400px] md:h-[500px]"
        style={{ display: "block" }}
      />
      
      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-foreground">Active Connections: 842</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary/20"></div>
            <span className="text-muted-foreground">Total Contacts: 1,247</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NetworkWorldMap;

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Mail, Phone, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getContacts, Contact } from "@/services/rel8t/contactService";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Inline SVG Ring Chart Component
const RingChart = () => {
  const totalContacts = 1247;
  const activeConnections = 842;
  const activePercentage = (activeConnections / totalContacts) * 100;
  
  const size = 96;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const activeStrokeDashoffset = circumference - (activePercentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      {/* Glassmorphic background circle */}
      <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm" />
      
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Inactive ring (blue) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Active ring (teal with flashing animation) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(20, 184, 166, 0.9)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={activeStrokeDashoffset}
          className="transition-all duration-300"
          style={{
            filter: "drop-shadow(0 0 8px rgba(20, 184, 166, 0.4))",
            animation: "pulse-glow 3s ease-in-out infinite"
          }}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg font-bold text-[rgba(20,184,166,0.9)]">
          {Math.round(activePercentage)}%
        </div>
        <div className="text-[10px] text-muted-foreground">
          Active
        </div>
      </div>
      
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const NetworkWorldMap = () => {
  const plexusCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  
  const totalContacts = 1247;
  const activeConnections = 842;
  const activePercentage = (activeConnections / totalContacts) * 100;
  
  const { data: categories = [] } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: getCategories,
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getContacts(),
  });

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
    <div className="w-full">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Card className="overflow-hidden glass-morphism border-0 bg-card/30 backdrop-blur-md">
          <CardContent className="p-0">
            <div className="relative p-6 lg:p-8">
              {/* Plexus Background */}
              <canvas
                ref={plexusCanvasRef}
                className="absolute inset-0 w-full h-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, hsl(var(--background)) 0%, hsl(var(--background)) 100%)",
                }}
              />

              {/* Content Layout - matches profile card structure */}
              <div className="relative z-10 flex items-center gap-4 sm:gap-6">
                {/* Ring Chart (left) - inline like avatar */}
                <RingChart />

                {/* Network Info (center) - matches profile info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-foreground mb-1">
                    Network
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Social Connection Analysis
                  </p>
                </div>
              </div>

              {/* Categories Accordion Section */}
              <div className="relative z-10 mt-4">
                <button
                  onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                  className="w-full glass-morphism bg-card/20 backdrop-blur-sm rounded-lg p-4 border-0 hover:bg-card/30 transition-all"
                >
                  <div className="space-y-3">
                    {/* Gradient percentage bar */}
                    <div className="relative h-10 rounded-lg overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-teal-500/80 to-blue-500/60 transition-all duration-500"
                        style={{ width: `${activePercentage}%` }}
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-blue-500/20"
                        style={{ left: `${activePercentage}%` }}
                      />
                      
                      {/* Overlay content */}
                      <div className="relative h-full flex items-center justify-between px-4">
                        <span className="text-sm font-medium text-white drop-shadow-lg">
                          {activeConnections} Active
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white/90 drop-shadow-lg">
                            {totalContacts} Total
                          </span>
                          {isCategoriesExpanded ? (
                            <ChevronUp className="w-5 h-5 text-white" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {isCategoriesExpanded && (
                  <div className="mt-3 glass-morphism bg-card/20 backdrop-blur-sm rounded-lg p-4 border-0 animate-accordion-down">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3">Contact Categories</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.slice(0, 8).map((category) => (
                          <Badge
                            key={category.id}
                            variant="tag"
                            className="px-3 py-1.5 justify-center truncate"
                            style={{ 
                              backgroundColor: `${category.color}20`,
                              borderColor: category.color,
                              color: category.color
                            }}
                          >
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Cards Section */}
              <div className="relative z-10 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contacts.slice(0, 8).map((contact) => (
                  <Card
                    key={contact.id}
                    className="glass-morphism border-0 bg-card/20 backdrop-blur-sm hover:bg-card/30 transition-all cursor-pointer group"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                            {contact.name}
                          </h3>
                          
                          {contact.organization && (
                            <p className="text-xs text-muted-foreground truncate">
                              {contact.organization}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            {contact.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[100px]">{contact.email}</span>
                              </div>
                            )}
                            {contact.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{contact.location}</span>
                              </div>
                            )}
                          </div>
                          
                          {contact.category && (
                            <Badge
                              variant="tag"
                              className="mt-2 px-2 py-0.5 text-xs"
                              style={{ 
                                backgroundColor: `${contact.category.color}20`,
                                borderColor: contact.category.color,
                                color: contact.category.color
                              }}
                            >
                              {contact.category.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import Navbar from "@/components/Navbar";

interface AnimatedAvatarProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const AnimatedAvatar = ({ title, className, children }: AnimatedAvatarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  // Format name as "First L" (first word + last initial)
  const formatName = (name: string) => {
    const words = name.split(" ");
    if (words.length === 1) return name;
    return `${words[0]} ${words[words.length - 1][0]}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={cn(
          "group relative w-16 h-16 rounded-full overflow-hidden border border-white/20 backdrop-blur-glass bg-gradient-to-br from-white/5 to-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer",
          className
        )}
        onClick={handleClick}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" className="w-full h-full">
          {children}
        </svg>
      </div>
      
      <Badge variant="teal" className="text-xs px-2 py-1">
        {formatName(title)}
      </Badge>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] glass-morphism border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-8">
            <div className={cn(
              "relative w-64 h-64 rounded-full overflow-hidden border-2 border-white/30 backdrop-blur-glass bg-gradient-to-br from-white/10 to-white/20 shadow-2xl",
              className
            )}>
              <svg width="256" height="256" viewBox="0 0 64 64" className="w-full h-full">
                {children}
              </svg>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function AvatarGallery() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="container mx-auto py-6 px-4">
        {/* Glassmorphic Header */}
        <div className="glass-morphism glass-morphism-hover rounded-3xl p-6 mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
            Space Avatar Gallery
          </h1>
          <p className="text-muted-foreground">
            20 unique animated space-themed avatars featuring planets, stars, galaxies, and cosmic phenomena
          </p>
        </div>

        <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20">
          <div className="grid grid-cols-3 md:grid-cols-8 lg:grid-cols-10 gap-6">
            
            <AnimatedAvatar title="Pulsar" className="bg-gradient-to-br from-primary/20 to-accent/20">
              <defs>
                <radialGradient id="pulsar" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="8" fill="url(#pulsar)">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="20" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.3">
                <animate attributeName="r" values="20;30;20" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="1s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Black Hole" className="bg-gradient-to-br from-foreground/30 to-background/20">
              <defs>
                <radialGradient id="blackHole" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--foreground))" />
                  <stop offset="80%" stopColor="hsl(var(--foreground))" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="12" fill="url(#blackHole)" />
              <circle cx="32" cy="32" r="18" fill="none" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="22" fill="none" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" values="360 32 32;0 32 32" dur="1s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Supernova" className="bg-gradient-to-br from-destructive/20 to-accent/20">
              <defs>
                <radialGradient id="supernova" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" />
                  <stop offset="50%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="4" fill="hsl(var(--destructive))">
                <animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="16" fill="url(#supernova)" opacity="0.5">
                <animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="20" fill="url(#supernova)" opacity="0.3">
                <animate attributeName="r" values="20;28;20" dur="3s" repeatCount="indefinite" begin="0.5s" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" begin="0.5s" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Nebula Swirl" className="bg-gradient-to-br from-primary/20 to-accent/20">
              <defs>
                <radialGradient id="nebula" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--primary) / 0.3)" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="16" fill="url(#nebula)">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="6s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Red Giant" className="bg-gradient-to-br from-destructive/20 to-primary/10">
              <defs>
                <radialGradient id="redGiant" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--destructive))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="14" fill="url(#redGiant)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="20" fill="hsl(var(--destructive) / 0.3)">
                <animate attributeName="r" values="20;24;20" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="White Dwarf" className="bg-gradient-to-br from-background/30 to-primary/20">
              <defs>
                <radialGradient id="whiteDwarf" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--background))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="6" fill="url(#whiteDwarf)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--background) / 0.6)" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="10s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Blue Giant" className="bg-gradient-to-br from-blue-400/20 to-cyan-500/20">
              <defs>
                <radialGradient id="blueGiant" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="14" fill="url(#blueGiant)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="20" fill="url(#blueGiant)" opacity="0.3">
                <animate attributeName="r" values="20;24;20" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Magnetosphere" className="bg-gradient-to-br from-primary/20 to-secondary/20">
              <defs>
                <radialGradient id="magnetosphere" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="8" fill="url(#magnetosphere)" />
              <circle cx="32" cy="32" r="16" fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Exoplanet" className="bg-gradient-to-br from-secondary/20 to-accent/20">
              <defs>
                <radialGradient id="exoplanet" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--secondary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="10" fill="url(#exoplanet)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="16" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="12s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="16" r="2" fill="hsl(var(--primary))">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="4s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Dark Matter" className="bg-gradient-to-br from-foreground/10 to-muted/20">
              <defs>
                <radialGradient id="darkMatter" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--foreground) / 0.3)" />
                  <stop offset="100%" stopColor="hsl(var(--muted) / 0.5)" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="12" fill="url(#darkMatter)">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="18" fill="none" stroke="hsl(var(--foreground) / 0.2)" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="8s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Time Dilation" className="bg-gradient-to-br from-foreground/20 to-primary/20">
              <defs>
                <radialGradient id="timeDilation" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--foreground))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="4" fill="url(#timeDilation)" />
              <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--foreground) / 0.4)" strokeWidth="2">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="16" fill="none" stroke="hsl(var(--primary) / 0.6)" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" values="360 32 32;0 32 32" dur="2s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Purple Giant" className="bg-gradient-to-br from-purple-500/20 to-violet-600/20">
              <defs>
                <radialGradient id="purpleGiant" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="12" fill="url(#purpleGiant)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="18" fill="url(#purpleGiant)" opacity="0.4">
                <animate attributeName="r" values="18;22;18" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Orange Dwarf" className="bg-gradient-to-br from-orange-400/20 to-red-500/20">
              <defs>
                <radialGradient id="orangeDwarf" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ef4444" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="10" fill="url(#orangeDwarf)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="12" fill="none" stroke="#fdba74" strokeWidth="1" opacity="0.4">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="8s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Hydrogen Atom" className="bg-gradient-to-br from-cyan-400/20 to-blue-500/20">
              <defs>
                <radialGradient id="hydrogenCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="4" fill="url(#hydrogenCore)" />
              <circle cx="32" cy="32" r="12" fill="none" stroke="#22d3ee" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="44" cy="32" r="2" fill="#3b82f6">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Helium Atom" className="bg-gradient-to-br from-green-400/20 to-emerald-500/20">
              <defs>
                <radialGradient id="heliumCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#10b981" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="4" fill="url(#heliumCore)" />
              <circle cx="32" cy="32" r="12" fill="none" stroke="#4ade80" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="44" cy="32" r="2" fill="#10b981">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="20" cy="32" r="2" fill="#10b981">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="1.5s" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Carbon Atom" className="bg-gradient-to-br from-gray-400/20 to-slate-500/20">
              <defs>
                <radialGradient id="carbonCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#9ca3af" />
                  <stop offset="100%" stopColor="#64748b" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="6" fill="url(#carbonCore)" />
              <circle cx="32" cy="32" r="16" fill="none" stroke="#9ca3af" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="48" cy="32" r="2" fill="#64748b">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="16" cy="32" r="2" fill="#64748b">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="1s" />
              </circle>
              <circle cx="32" cy="48" r="2" fill="#64748b">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="2s" />
              </circle>
              <circle cx="32" cy="16" r="2" fill="#64748b">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="3s" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Oxygen Atom" className="bg-gradient-to-br from-red-400/20 to-pink-500/20">
              <defs>
                <radialGradient id="oxygenCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#ec4899" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="6" fill="url(#oxygenCore)" />
              <circle cx="32" cy="32" r="18" fill="none" stroke="#f87171" strokeWidth="1">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="32" r="2" fill="#ec4899">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="14" cy="32" r="2" fill="#ec4899">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="1s" />
              </circle>
              <circle cx="32" cy="50" r="2" fill="#ec4899">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="2s" />
              </circle>
              <circle cx="32" cy="14" r="2" fill="#ec4899">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="3s" />
              </circle>
              <circle cx="41" cy="23" r="2" fill="#ec4899">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="4s" />
              </circle>
              <circle cx="23" cy="41" r="2" fill="#ec4899">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" begin="5s" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Iron Atom" className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20">
              <defs>
                <radialGradient id="ironCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#ea580c" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="8" fill="url(#ironCore)" />
              <circle cx="32" cy="32" r="12" fill="none" stroke="#ca8a04" strokeWidth="1" opacity="0.7">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="20" fill="none" stroke="#ea580c" strokeWidth="1" opacity="0.5">
                <animateTransform attributeName="transform" type="rotate" values="360 32 32;0 32 32" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="44" cy="32" r="1.5" fill="#ca8a04">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="20" cy="32" r="1.5" fill="#ca8a04">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="2s" repeatCount="indefinite" begin="1s" />
              </circle>
            </AnimatedAvatar>

            <AnimatedAvatar title="Gold Atom" className="bg-gradient-to-br from-yellow-400/20 to-amber-500/20">
              <defs>
                <radialGradient id="goldCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="8" fill="url(#goldCore)">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="12" fill="none" stroke="#facc15" strokeWidth="1" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="16" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.4">
                <animateTransform attributeName="transform" type="rotate" values="360 32 32;0 32 32" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="32" r="20" fill="none" stroke="#facc15" strokeWidth="1" opacity="0.3">
                <animateTransform attributeName="transform" type="rotate" values="0 32 32;360 32 32" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </AnimatedAvatar>
          </div>
        </div>
      </div>
    </div>
  );
}
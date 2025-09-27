import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import Navbar from "@/components/Navbar";

interface AnimatedAvatarProps {
  title: string;
  className?: string;
  avatarClass: string;
}

const AnimatedAvatar = ({ title, className, avatarClass }: AnimatedAvatarProps) => {
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
        <div className={cn("avatar-base", avatarClass)} />
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
              <div className={cn("avatar-base", avatarClass)} />
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
            
            <AnimatedAvatar 
              title="Pulsar" 
              className="bg-gradient-to-br from-primary/20 to-accent/20"
              avatarClass="avatar-pulsar"
            />

            <AnimatedAvatar 
              title="Black Hole" 
              className="bg-gradient-to-br from-foreground/30 to-background/20"
              avatarClass="avatar-black-hole"
            />

            <AnimatedAvatar 
              title="Supernova" 
              className="bg-gradient-to-br from-destructive/20 to-accent/20"
              avatarClass="avatar-supernova"
            />

            <AnimatedAvatar 
              title="Nebula Swirl" 
              className="bg-gradient-to-br from-primary/20 to-accent/20"
              avatarClass="avatar-nebula"
            />

            <AnimatedAvatar 
              title="Red Giant" 
              className="bg-gradient-to-br from-destructive/20 to-primary/10"
              avatarClass="avatar-red-giant"
            />

            <AnimatedAvatar 
              title="White Dwarf" 
              className="bg-gradient-to-br from-background/30 to-primary/20"
              avatarClass="avatar-white-dwarf"
            />

            <AnimatedAvatar 
              title="Blue Giant" 
              className="bg-gradient-to-br from-blue-400/20 to-cyan-500/20"
              avatarClass="avatar-blue-giant"
            />

            <AnimatedAvatar 
              title="Magnetosphere" 
              className="bg-gradient-to-br from-primary/20 to-secondary/20"
              avatarClass="avatar-magnetosphere"
            />

            <AnimatedAvatar 
              title="Exoplanet" 
              className="bg-gradient-to-br from-secondary/20 to-accent/20"
              avatarClass="avatar-exoplanet"
            />

            <AnimatedAvatar 
              title="Dark Matter" 
              className="bg-gradient-to-br from-foreground/10 to-muted/20"
              avatarClass="avatar-dark-matter"
            />

            <AnimatedAvatar 
              title="Time Dilation" 
              className="bg-gradient-to-br from-foreground/20 to-primary/20"
              avatarClass="avatar-time-dilation"
            />

            <AnimatedAvatar 
              title="Purple Giant" 
              className="bg-gradient-to-br from-purple-500/20 to-violet-600/20"
              avatarClass="avatar-purple-giant"
            />

            <AnimatedAvatar 
              title="Orange Dwarf" 
              className="bg-gradient-to-br from-orange-400/20 to-red-500/20"
              avatarClass="avatar-orange-dwarf"
            />

            <AnimatedAvatar 
              title="Hydrogen Atom" 
              className="bg-gradient-to-br from-cyan-400/20 to-blue-500/20"
              avatarClass="avatar-hydrogen"
            />

            <AnimatedAvatar 
              title="Helium Atom" 
              className="bg-gradient-to-br from-green-400/20 to-emerald-500/20"
              avatarClass="avatar-helium"
            />

            <AnimatedAvatar 
              title="Quasar" 
              className="bg-gradient-to-br from-primary/30 to-accent/30"
              avatarClass="avatar-pulsar"
            />

            <AnimatedAvatar 
              title="Neutron Star" 
              className="bg-gradient-to-br from-background/40 to-secondary/30"
              avatarClass="avatar-white-dwarf"
            />

            <AnimatedAvatar 
              title="Solar Flare" 
              className="bg-gradient-to-br from-destructive/30 to-orange-500/20"
              avatarClass="avatar-red-giant"
            />

            <AnimatedAvatar 
              title="Cosmic Ray" 
              className="bg-gradient-to-br from-primary/20 to-blue-400/20"
              avatarClass="avatar-magnetosphere"
            />

            <AnimatedAvatar 
              title="Gamma Burst" 
              className="bg-gradient-to-br from-purple-400/20 to-pink-500/20"
              avatarClass="avatar-supernova"
            />
            
          </div>
        </div>
      </div>
    </div>
  );
}
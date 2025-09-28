import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { SolarSystem } from "@/components/ui/SolarSystem";
import { SOLAR_SYSTEMS } from "@/data/solarSystemsConfig";

interface SolarSystemAvatarProps {
  systemId: string;
  title: string;
}

const SolarSystemAvatar = ({ systemId, title }: SolarSystemAvatarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <SolarSystem 
        systemId={systemId}
        size={64}
        onClick={handleClick}
      />
      
      <div className="solar-system-info">
        <Badge variant="secondary" className="solar-system-code">
          {systemId}
        </Badge>
        <p className="solar-system-name">
          {title}
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] glass-morphism border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {title}
            </DialogTitle>
            <p className="text-center text-muted-foreground">{systemId}</p>
          </DialogHeader>
          <div className="flex justify-center items-center p-8">
            <SolarSystem 
              systemId={systemId}
              size={256}
            />
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
          <h1 className="solar-system-title bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Solar System Gallery
          </h1>
          <p className="solar-system-subtitle">
            40 unique animated solar system configurations with predefined styles and identifiers
          </p>
        </div>

        <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20">
          <div className="solar-system-grid">
            {Object.entries(SOLAR_SYSTEMS).map(([systemId, config]) => (
              <SolarSystemAvatar 
                key={systemId}
                systemId={systemId}
                title={config.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { SolarSystem } from "@/components/ui/SolarSystem";
import { SOLAR_SYSTEMS } from "@/data/solarSystemsConfig";
import { ArrowLeft, Palette } from "lucide-react";

interface SolarSystemAvatarProps {
  systemId: string;
  title: string;
}

const SolarSystemAvatar = ({ systemId, title }: SolarSystemAvatarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setIsDialogOpen(true)}>
      <div className="p-2 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-105">
        <SolarSystem 
          systemId={systemId}
          size={64}
        />
      </div>
      
      <div className="text-center">
        <Badge variant="outline" className="text-xs border-primary/20 text-primary bg-primary/5">
          {systemId}
        </Badge>
        <p className="text-xs text-muted-foreground mt-1 truncate max-w-[80px]">
          {title}
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] border-white/10 bg-card/95 backdrop-blur-xl">
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
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />

      <div className="w-full px-4 py-6">
        <div className="container mx-auto max-w-7xl space-y-6">
          <AdminNavigation />

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin')}
            className="text-muted-foreground hover:text-foreground -mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Solar System Gallery</h2>
              <p className="text-sm text-muted-foreground">40 unique animated solar system configurations with predefined styles</p>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
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
    </div>
  );
}

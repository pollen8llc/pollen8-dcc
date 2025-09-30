import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Globe, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const regions = [
  { id: "global", name: "Global", icon: Globe },
  { id: "north-america", name: "North America", icon: MapPin },
  { id: "europe", name: "Europe", icon: MapPin },
  { id: "asia", name: "Asia", icon: MapPin },
  { id: "south-america", name: "South America", icon: MapPin },
  { id: "africa", name: "Africa", icon: MapPin },
  { id: "oceania", name: "Oceania", icon: MapPin },
  { id: "middle-east", name: "Middle East", icon: MapPin },
];

const P8Loc8 = () => {
  const navigate = useNavigate();
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["global"]);

  const toggleRegion = (id: string) => {
    if (id === "global") {
      setSelectedRegions(["global"]);
    } else {
      const newSelection = selectedRegions.filter((r) => r !== "global");
      if (newSelection.includes(id)) {
        const filtered = newSelection.filter((r) => r !== id);
        setSelectedRegions(filtered.length === 0 ? ["global"] : filtered);
      } else {
        setSelectedRegions([...newSelection, id]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Progress */}
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 1 of 4
          </Badge>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Target Locations</h1>
          <p className="text-muted-foreground">Where is your network active?</p>
        </div>

        {/* Location Grid */}
        <Card className="p-8 bg-background/40 backdrop-blur-xl border-primary/20 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {regions.map((region) => {
              const isSelected = selectedRegions.includes(region.id);
              const Icon = region.icon;
              return (
                <button
                  key={region.id}
                  onClick={() => toggleRegion(region.id)}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? "bg-primary/20 border-primary shadow-lg shadow-primary/20"
                      : "bg-background/60 border-border hover:border-primary/40"
                  }`}
                >
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <p className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>{region.name}</p>
                </button>
              );
            })}
          </div>

          {selectedRegions.length > 0 && (
            <div className="pt-4 border-t animate-fade-in">
              <p className="text-sm text-muted-foreground mb-2">Selected regions:</p>
              <div className="flex flex-wrap gap-2">
                {selectedRegions.map((id) => {
                  const region = regions.find((r) => r.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="bg-primary/20 text-primary">
                      {region?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/p8")} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <Button onClick={() => navigate("/p8/asl")} className="group">
            Continue
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default P8Loc8;

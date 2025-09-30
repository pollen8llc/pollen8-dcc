import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Gamepad2, Laptop, Heart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const networkTypes = [
  {
    id: "esports",
    name: "Esports",
    icon: Gamepad2,
    description: "Gaming communities, tournaments, and competitive gaming",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "tech",
    name: "Tech",
    icon: Laptop,
    description: "Developer communities, tech meetups, and innovation hubs",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "wellness",
    name: "Wellness",
    icon: Heart,
    description: "Health, fitness, mindfulness, and lifestyle communities",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "fanbase",
    name: "Fanbase",
    icon: Users,
    description: "Creator communities, fan clubs, and content creators",
    color: "from-orange-500/20 to-red-500/20",
  },
];

const P8Class = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* Progress */}
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 3 of 4
          </Badge>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Type of Network</h1>
          <p className="text-muted-foreground">What kind of community are you building?</p>
        </div>

        {/* Network Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {networkTypes.map((type, index) => {
            const isSelected = selectedType === type.id;
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-8 cursor-pointer transition-all duration-300 hover:scale-105 border-2 animate-fade-in ${
                  isSelected
                    ? "bg-primary/10 backdrop-blur-xl border-primary shadow-lg shadow-primary/20"
                    : "bg-background/40 backdrop-blur-xl border-primary/20 hover:border-primary/40"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                  <Icon className={`h-8 w-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isSelected ? "text-primary" : ""}`}>{type.name}</h3>
                <p className="text-muted-foreground text-sm">{type.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Selected Type Info */}
        {selectedType && (
          <Card className="p-6 bg-primary/10 backdrop-blur-xl border-primary/30 animate-scale-in">
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-primary/20 text-primary">Selected</Badge>
              <span className="font-medium">{networkTypes.find((t) => t.id === selectedType)?.name}</span>
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/p8/asl")} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <Button onClick={() => navigate("/p8/intgr8")} disabled={!selectedType} className="group">
            Continue
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default P8Class;

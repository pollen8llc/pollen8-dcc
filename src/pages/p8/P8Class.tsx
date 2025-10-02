import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadarChart } from "@/components/ui/radar-chart";

const psychographics = [
  {
    id: "interest",
    label: "Interest",
    color: "hsl(var(--chart-1))",
    options: ["Gaming", "Technology", "Sports", "Arts & Culture", "Business", "Health & Fitness", "Entertainment", "Education"],
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    color: "hsl(var(--chart-2))",
    options: ["Urban", "Suburban", "Rural", "Nomadic", "Minimalist", "Luxury", "Active", "Relaxed"],
  },
  {
    id: "values",
    label: "Values",
    color: "hsl(var(--chart-3))",
    options: ["Innovation", "Community", "Sustainability", "Achievement", "Creativity", "Security", "Freedom", "Tradition"],
  },
  {
    id: "attitudes",
    label: "Attitudes",
    color: "hsl(var(--chart-4))",
    options: ["Optimistic", "Pragmatic", "Adventurous", "Cautious", "Collaborative", "Independent", "Progressive", "Conservative"],
  },
];

interface ImportanceState {
  [key: string]: number;
}

interface SelectedOptionsState {
  [key: string]: string;
}

interface RadarDataPoint {
  category: string;
  importance: number;
  color: string;
}

const P8Class = () => {
  const navigate = useNavigate();
  
  // Load ASL demographics data from localStorage
  const [aslData, setAslData] = useState<RadarDataPoint[]>([]);
  
  // Class psychographics state
  const [importance, setImportance] = useState<ImportanceState>({
    interest: 50,
    lifestyle: 50,
    values: 50,
    attitudes: 50,
  });
  
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsState>({});

  useEffect(() => {
    // Load ASL demographics data
    const savedAslImportance = localStorage.getItem("p8_asl_importance");
    if (savedAslImportance) {
      const aslImportance = JSON.parse(savedAslImportance);
      const demographics = [
        { id: "age", label: "Age", color: "hsl(var(--chart-1))" },
        { id: "status", label: "Status", color: "hsl(var(--chart-2))" },
        { id: "gender", label: "Gender", color: "hsl(var(--chart-3))" },
        { id: "race", label: "Race", color: "hsl(var(--chart-4))" },
      ];
      
      const aslRadarData = demographics.map(demo => ({
        category: demo.label,
        importance: aslImportance[demo.id] || 0,
        color: demo.color,
      }));
      setAslData(aslRadarData);
    }
  }, []);

  useEffect(() => {
    // Save Class data to localStorage
    localStorage.setItem("p8_class_importance", JSON.stringify(importance));
    localStorage.setItem("p8_class_options", JSON.stringify(selectedOptions));
  }, [importance, selectedOptions]);

  const classRadarData: RadarDataPoint[] = psychographics.map(psycho => ({
    category: psycho.label,
    importance: importance[psycho.id],
    color: psycho.color,
  }));

  const totalScore = Object.values(importance).reduce((sum, val) => sum + val, 0);
  const isComplete = Object.keys(selectedOptions).length === psychographics.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Progress */}
        <div className="flex items-center space-x-2 mb-6">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 3 of 4
          </Badge>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold">Psychographic Classification</h1>
          <p className="text-muted-foreground">Define the psychographic profile of your community</p>
        </div>

        {/* Main Canvas - Overlaid Radar Charts */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl" />
          <Card className="relative bg-background/40 backdrop-blur-xl border-primary/20 p-8 w-full max-w-2xl">
            <div className="flex flex-col items-center">
              {/* Overlay both charts */}
              <div className="relative w-full h-[500px]">
                {/* ASL Demographics (background layer) */}
                {aslData.length > 0 && (
                  <div className="absolute inset-0 opacity-40">
                    <RadarChart data={aslData} width={500} height={500} />
                  </div>
                )}
                
                {/* Class Psychographics (foreground layer) */}
                <div className="absolute inset-0">
                  <RadarChart data={classRadarData} width={500} height={500} />
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex gap-6 items-center justify-center flex-wrap">
                {aslData.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary/40 border-2 border-primary/60" />
                    <span className="text-sm text-muted-foreground">Demographics (ASL)</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary border-2 border-primary" />
                  <span className="text-sm font-medium">Psychographics (Class)</span>
                </div>
              </div>

              {/* Total Score */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">Total Priority Score</p>
                <p className="text-3xl font-bold text-primary">{totalScore}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Desktop Controls - Left Overlay */}
        <div className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 w-80 max-h-[70vh] overflow-y-auto z-20">
          <Card className="bg-background/95 backdrop-blur-xl border-primary/30 shadow-2xl">
            <div className="p-6 border-b border-primary/20">
              <h2 className="text-xl font-bold">Psychographic Controls</h2>
              <p className="text-sm text-muted-foreground mt-1">Define each dimension</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {psychographics.map((psycho) => (
                <AccordionItem key={psycho.id} value={psycho.id} className="border-b border-primary/10">
                  <AccordionTrigger className="px-6 py-4 hover:bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: psycho.color }}
                      />
                      <span className="font-medium">{psycho.label}</span>
                      {selectedOptions[psycho.id] && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {selectedOptions[psycho.id]}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 space-y-4">
                    {/* Dropdown */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Option</label>
                      <Select
                        value={selectedOptions[psycho.id] || ""}
                        onValueChange={(value) => 
                          setSelectedOptions(prev => ({ ...prev, [psycho.id]: value }))
                        }
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder={`Choose ${psycho.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {psycho.options.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Importance Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Importance</label>
                        <span className="text-sm font-bold" style={{ color: psycho.color }}>
                          {importance[psycho.id]}%
                        </span>
                      </div>
                      <Slider
                        value={[importance[psycho.id]]}
                        onValueChange={(value) => 
                          setImportance(prev => ({ ...prev, [psycho.id]: value[0] }))
                        }
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>

        {/* Mobile Controls - Bottom Overlay */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 max-h-[50vh] overflow-y-auto z-20">
          <Card className="bg-background/95 backdrop-blur-xl border-t-2 border-primary/30 rounded-t-3xl shadow-2xl">
            <div className="p-4 border-b border-primary/20">
              <div className="w-12 h-1 bg-primary/30 rounded-full mx-auto mb-4" />
              <h2 className="text-lg font-bold">Psychographic Controls</h2>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {psychographics.map((psycho) => (
                <AccordionItem key={psycho.id} value={psycho.id} className="border-b border-primary/10">
                  <AccordionTrigger className="px-4 py-3 hover:bg-primary/5">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: psycho.color }}
                      />
                      <span className="text-sm font-medium">{psycho.label}</span>
                      {selectedOptions[psycho.id] && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {selectedOptions[psycho.id]}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3 space-y-3">
                    {/* Dropdown */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Select Option</label>
                      <Select
                        value={selectedOptions[psycho.id] || ""}
                        onValueChange={(value) => 
                          setSelectedOptions(prev => ({ ...prev, [psycho.id]: value }))
                        }
                      >
                        <SelectTrigger className="bg-background/50 h-9">
                          <SelectValue placeholder={`Choose ${psycho.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {psycho.options.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Importance Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium">Importance</label>
                        <span className="text-xs font-bold" style={{ color: psycho.color }}>
                          {importance[psycho.id]}%
                        </span>
                      </div>
                      <Slider
                        value={[importance[psycho.id]]}
                        onValueChange={(value) => 
                          setImportance(prev => ({ ...prev, [psycho.id]: value[0] }))
                        }
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 mb-20 md:mb-8">
          <Button variant="outline" onClick={() => navigate("/p8/asl")} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <Button onClick={() => navigate("/p8/intgr8")} disabled={!isComplete} className="group">
            Continue
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default P8Class;

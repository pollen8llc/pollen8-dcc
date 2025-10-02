import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadarChart } from "@/components/ui/radar-chart";

const psychographics = [
  {
    id: "interest",
    label: "Interest",
    color: "#3b82f6",
    options: ["Gaming", "Technology", "Sports", "Arts & Culture", "Business", "Health & Fitness", "Entertainment", "Education"],
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    color: "#60a5fa",
    options: ["Urban", "Suburban", "Rural", "Nomadic", "Minimalist", "Luxury", "Active", "Relaxed"],
  },
  {
    id: "values",
    label: "Values",
    color: "#2563eb",
    options: ["Innovation", "Community", "Sustainability", "Achievement", "Creativity", "Security", "Freedom", "Tradition"],
  },
  {
    id: "attitudes",
    label: "Attitudes",
    color: "#1d4ed8",
    options: ["Optimistic", "Pragmatic", "Adventurous", "Cautious", "Collaborative", "Independent", "Progressive", "Conservative"],
  },
];

// Importance level labels
const importanceLevels = [
  { value: 0, label: "Low" },
  { value: 25, label: "Moderate" },
  { value: 50, label: "Important" },
  { value: 75, label: "Critical" },
  { value: 100, label: "Essential" },
];

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
  const [importance, setImportance] = useState<Record<string, number>>({
    interest: 50,
    lifestyle: 50,
    values: 50,
    attitudes: 50,
  });
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load ASL demographics data
    const savedAslImportance = localStorage.getItem("p8_asl_importance");
    if (savedAslImportance) {
      const aslImportance = JSON.parse(savedAslImportance);
      const demographics = [
        { id: "age", label: "Age Range", color: "#00eada" },
        { id: "status", label: "Professional Status", color: "#8b5cf6" },
        { id: "gender", label: "Gender", color: "#f97316" },
        { id: "race", label: "Ethnicity", color: "#06b6d4" },
      ];
      
      const aslRadarData = demographics.map(demo => ({
        category: demo.label,
        importance: aslImportance[demo.id] || 0,
        color: demo.color,
      }));
      setAslData(aslRadarData);
    }

    // Load saved Class data
    const savedImportance = localStorage.getItem("p8_class_importance");
    const savedOptions = localStorage.getItem("p8_class_options");
    if (savedImportance) {
      setImportance(JSON.parse(savedImportance));
    }
    if (savedOptions) {
      setSelectedOptions(JSON.parse(savedOptions));
    }
  }, []);

  useEffect(() => {
    // Save Class data to localStorage
    localStorage.setItem("p8_class_importance", JSON.stringify(importance));
    localStorage.setItem("p8_class_options", JSON.stringify(selectedOptions));
  }, [importance, selectedOptions]);

  const updateImportance = (categoryId: string, value: number[]) => {
    // Snap to nearest step
    const snappedValue = Math.round(value[0] / 25) * 25;
    setImportance({ ...importance, [categoryId]: snappedValue });
  };

  // Generate radar chart data based on importance levels
  const classRadarData = useMemo(() => {
    return psychographics.map(psycho => ({
      category: psycho.label,
      importance: importance[psycho.id] || 0,
      color: psycho.color,
    }));
  }, [importance]);

  // Calculate total importance
  const totalImportance = useMemo(() => {
    return Object.values(importance).reduce((sum, val) => sum + val, 0);
  }, [importance]);

  // Get importance label
  const getImportanceLabel = (value: number) => {
    const level = importanceLevels.find(l => l.value === value);
    return level?.label || "Not Set";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-3 md:space-y-4 animate-fade-in p-2 md:p-4">
        {/* Progress */}
        <div className="flex items-center space-x-2 px-2">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 3 of 4
          </Badge>
        </div>

        {/* Canvas Container */}
        <Card className="p-2 md:p-4 bg-background/20 backdrop-blur-sm border-primary/10">
          <div className="relative w-full h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] max-h-[700px] rounded-lg overflow-hidden bg-gradient-to-br from-background/10 via-primary/5 to-primary/10">
            
            {/* Center Overlaid Radar Charts */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-2xl h-full flex flex-col items-center justify-center p-4">
                <div className="relative w-full h-[500px] flex items-center justify-center">
                  {/* ASL Demographics (background layer - + layout) */}
                  {aslData.length > 0 && (
                    <div className="absolute inset-0 opacity-40">
                      <RadarChart 
                        data={aslData} 
                        width={500} 
                        height={500}
                        angleOffset={0}
                        strokeColor="hsl(var(--primary))"
                        fillColor="hsl(var(--primary))"
                      />
                    </div>
                  )}
                  
                  {/* Class Psychographics (foreground layer - X layout, blue) */}
                  <div className="absolute inset-0">
                    <RadarChart 
                      data={classRadarData} 
                      width={500} 
                      height={500}
                      angleOffset={45}
                      strokeColor="#3b82f6"
                      fillColor="#3b82f6"
                    />
                  </div>
                </div>
                
                {/* Legend & Total Score */}
                <div className="text-center mt-2 bg-background/70 backdrop-blur-xl px-6 py-3 rounded-lg border border-primary/20 shadow-lg">
                  <div className="flex gap-4 items-center justify-center mb-2">
                    {aslData.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-primary/40 border-2 border-primary" />
                        <span className="text-xs text-muted-foreground">Demographics (+)</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-500" />
                      <span className="text-xs font-medium">Psychographics (X)</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Priority Score</p>
                  <p className="text-3xl font-bold text-primary">{totalImportance}</p>
                </div>
              </div>
            </div>

            {/* Top Header - Mobile only */}
            <div className="lg:hidden absolute top-3 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
              <Badge className="bg-background/80 backdrop-blur-md border-primary/20 text-primary px-4 py-2 text-sm flex items-center gap-2 shadow-lg">
                <Brain className="h-4 w-4" />
                Define Psychographics
              </Badge>
            </div>

            {/* Left Side Overlay Panel - Desktop Only */}
            <div className="hidden lg:flex absolute left-4 top-4 bottom-4 w-80 flex-col gap-3 z-20 animate-fade-in overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {/* Header */}
              <div className="px-4 py-3 bg-background/80 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Psychographic Settings
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Adjust importance levels for each category
                </p>
              </div>

              {/* Psychographic Accordion */}
              <Accordion type="single" collapsible className="space-y-2">
                {psychographics.map((category, index) => (
                  <AccordionItem
                    key={category.id}
                    value={category.id}
                    className="bg-background/70 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-background/75 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-semibold text-foreground/90">
                          {category.label}
                        </span>
                        {selectedOptions[category.id] && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {selectedOptions[category.id]}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3 space-y-3">
                      {/* Dropdown Selection */}
                      <Select
                        value={selectedOptions[category.id] || ""}
                        onValueChange={(value) => setSelectedOptions({ ...selectedOptions, [category.id]: value })}
                      >
                        <SelectTrigger className="w-full bg-background/50 border-primary/20">
                          <SelectValue placeholder={`Select ${category.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-xl border-primary/20 z-50">
                          {category.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Importance Label */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Importance</span>
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                            borderColor: `${category.color}40`
                          }}
                        >
                          {getImportanceLabel(importance[category.id])}
                        </Badge>
                      </div>

                      {/* Tactile Slider with Steps */}
                      <div className="space-y-2">
                        <Slider
                          value={[importance[category.id]]}
                          onValueChange={(value) => updateImportance(category.id, value)}
                          max={100}
                          step={25}
                          className="w-full"
                        />
                        {/* Step Indicators */}
                        <div className="flex justify-between text-[10px] text-muted-foreground/60 px-1">
                          {importanceLevels.map(level => (
                            <span 
                              key={level.value}
                              className={importance[category.id] === level.value ? 'text-primary font-semibold' : ''}
                            >
                              {level.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Bottom Overlay Panel - Mobile Only */}
            <div className="lg:hidden absolute bottom-0 left-0 right-0 z-20 animate-fade-in p-3 bg-gradient-to-t from-background/95 via-background/80 to-transparent backdrop-blur-xl pt-6 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <Accordion type="single" collapsible className="space-y-2">
                {psychographics.map((category, index) => (
                  <AccordionItem
                    key={category.id}
                    value={category.id}
                    className="bg-background/70 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <AccordionTrigger className="px-3 py-2.5 hover:bg-background/75 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-xs font-semibold text-foreground/90">
                          {category.label}
                        </span>
                        {selectedOptions[category.id] && (
                          <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                            {selectedOptions[category.id]}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-2.5 space-y-2">
                      {/* Dropdown Selection */}
                      <Select
                        value={selectedOptions[category.id] || ""}
                        onValueChange={(value) => setSelectedOptions({ ...selectedOptions, [category.id]: value })}
                      >
                        <SelectTrigger className="w-full bg-background/50 border-primary/20 h-8 text-xs">
                          <SelectValue placeholder={`Select ${category.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-xl border-primary/20 z-50">
                          {category.options.map((option) => (
                            <SelectItem key={option} value={option} className="text-xs">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Importance Badge & Slider */}
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className="text-[10px] px-2 py-0.5 flex-shrink-0"
                          style={{ 
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                          }}
                        >
                          {getImportanceLabel(importance[category.id])}
                        </Badge>
                        <Slider
                          value={[importance[category.id]]}
                          onValueChange={(value) => updateImportance(category.id, value)}
                          max={100}
                          step={25}
                          className="flex-1"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Instructions - Bottom Right */}
            <div className="absolute bottom-3 right-3 text-[10px] md:text-xs text-muted-foreground/60 z-10 bg-background/40 backdrop-blur-sm px-2 py-1 rounded">
              <p>Slide to adjust importance</p>
            </div>
          </div>
        </Card>

        {/* Navigation - Sticky on all screens */}
        <div className="sticky bottom-0 z-30 bg-background/80 backdrop-blur-lg border-t border-primary/10 -mx-2 md:-mx-4 px-4 py-3 mt-4">
          <div className="max-w-7xl mx-auto flex justify-between">
            <Button variant="outline" onClick={() => navigate("/p8/asl")} className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>
            <Button onClick={() => navigate("/p8/intgr8")} className="group">
              Continue
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P8Class;

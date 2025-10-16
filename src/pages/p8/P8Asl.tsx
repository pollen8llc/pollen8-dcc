import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Users, Brain, Check, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadarChart } from "@/components/ui/radar-chart";
import { Progress } from "@/components/ui/progress";

// Combined vectors: 4 Demographics + 4 Psychographics
const allVectors = [
  // Demographics
  { 
    id: "age", 
    label: "Age Range", 
    category: "Demographics",
    options: ["18-24", "25-34", "35-44", "45-54", "55+"], 
    color: "#00eada",
    icon: Users 
  },
  { 
    id: "status", 
    label: "Professional Status", 
    category: "Demographics",
    options: ["Student", "Employee", "Entrepreneur", "Freelancer", "Executive"], 
    color: "#8b5cf6",
    icon: Users 
  },
  { 
    id: "gender", 
    label: "Gender", 
    category: "Demographics",
    options: ["All", "Male", "Female", "Non-binary", "Prefer not to specify"], 
    color: "#f97316",
    icon: Users 
  },
  { 
    id: "race", 
    label: "Ethnicity", 
    category: "Demographics",
    options: ["All", "Asian", "Black", "Hispanic", "White", "Mixed", "Other"], 
    color: "#06b6d4",
    icon: Users 
  },
  // Psychographics
  {
    id: "interest",
    label: "Interest",
    category: "Psychographics",
    options: ["Gaming", "Technology", "Sports", "Arts & Culture", "Business", "Health & Fitness", "Entertainment", "Education"],
    color: "#3b82f6",
    icon: Brain
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    category: "Psychographics",
    options: ["Urban", "Suburban", "Rural", "Nomadic", "Minimalist", "Luxury", "Active", "Relaxed"],
    color: "#60a5fa",
    icon: Brain
  },
  {
    id: "values",
    label: "Values",
    category: "Psychographics",
    options: ["Innovation", "Community", "Sustainability", "Achievement", "Creativity", "Security", "Freedom", "Tradition"],
    color: "#2563eb",
    icon: Brain
  },
  {
    id: "attitudes",
    label: "Attitudes",
    category: "Psychographics",
    options: ["Optimistic", "Pragmatic", "Adventurous", "Cautious", "Collaborative", "Independent", "Progressive", "Conservative"],
    color: "#1d4ed8",
    icon: Brain
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

const P8Asl = () => {
  const navigate = useNavigate();
  const [currentVector, setCurrentVector] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<string>(allVectors[0].id);
  const [importance, setImportance] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("p8_combined_importance");
    if (saved) return JSON.parse(saved);
    return Object.fromEntries(allVectors.map(v => [v.id, 50]));
  });
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("p8_combined_options");
    if (saved) return JSON.parse(saved);
    return Object.fromEntries(allVectors.map(v => [v.id, v.options[0]]));
  });
  const [completedVectors, setCompletedVectors] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("p8_combined_progress");
    if (saved) return new Set(JSON.parse(saved));
    return new Set();
  });

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("p8_combined_importance", JSON.stringify(importance));
    localStorage.setItem("p8_combined_options", JSON.stringify(selectedOptions));
    localStorage.setItem("p8_combined_progress", JSON.stringify(Array.from(completedVectors)));
  }, [importance, selectedOptions, completedVectors]);

  const updateImportance = (categoryId: string, value: number[]) => {
    const snappedValue = Math.round(value[0] / 25) * 25;
    setImportance({ ...importance, [categoryId]: snappedValue });
    
    // Mark as completed if value > 0
    const vectorIndex = allVectors.findIndex(v => v.id === categoryId);
    if (snappedValue > 0 && !completedVectors.has(vectorIndex)) {
      setCompletedVectors(prev => new Set(prev).add(vectorIndex));
      
      // Auto-advance to next vector after 500ms
      setTimeout(() => {
        if (vectorIndex < 7) {
          setCurrentVector(vectorIndex + 1);
          setActiveAccordion(allVectors[vectorIndex + 1].id);
        }
      }, 500);
    }
  };

  // Generate radar chart data based on importance levels
  const radarData = useMemo(() => {
    return allVectors.map(vector => ({
      category: vector.label,
      importance: importance[vector.id] || 0,
      color: vector.color,
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

  const allCompleted = completedVectors.size === 8;
  const progressPercent = (completedVectors.size / 8) * 100;

  const handlePrevious = () => {
    if (currentVector > 0) {
      setCurrentVector(currentVector - 1);
      setActiveAccordion(allVectors[currentVector - 1].id);
    }
  };

  const handleNext = () => {
    if (currentVector < 7) {
      setCurrentVector(currentVector + 1);
      setActiveAccordion(allVectors[currentVector + 1].id);
    } else if (allCompleted) {
      navigate("/p8/intgr8");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-3 md:space-y-4 animate-fade-in p-2 md:p-4">
        {/* Progress */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
              Step 2 of 4
            </Badge>
            <Badge variant="outline" className="bg-background/80 text-foreground/80 border-border">
              Question {currentVector + 1} of 8
            </Badge>
          </div>
          <div className="hidden md:block text-xs text-muted-foreground">
            {completedVectors.size} / 8 completed
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-2">
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Canvas Container */}
        <Card className="p-2 md:p-4 bg-background/20 backdrop-blur-sm border-primary/10">
          <div className="relative w-full h-[calc(100vh-240px)] md:h-[calc(100vh-220px)] max-h-[700px] rounded-lg overflow-hidden bg-gradient-to-br from-background/10 via-primary/5 to-primary/10">
            
            {/* Center Radar Chart */}
            <div className="absolute inset-0 flex items-center justify-center pt-8 pb-4">
              <div className="w-full max-w-xl h-full flex flex-col items-center justify-start p-4">
                <div className="w-full h-[350px] lg:h-[400px] flex items-center justify-center">
                  <RadarChart 
                    data={radarData} 
                    width={350} 
                    height={350} 
                    activeVector={currentVector}
                    completedVectors={completedVectors}
                  />
                </div>
                <div className="text-center mt-2 bg-background/70 backdrop-blur-xl px-6 py-3 rounded-lg border border-primary/20 shadow-lg">
                  <p className="text-sm text-muted-foreground">Total Priority Score</p>
                  <p className="text-3xl font-bold text-primary">{totalImportance}</p>
                </div>
              </div>
            </div>

            {/* Top Header - Mobile only */}
            <div className="lg:hidden absolute top-3 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
              <Badge className="bg-background/80 backdrop-blur-md border-primary/20 text-primary px-4 py-2 text-sm flex items-center gap-2 shadow-lg">
                <Users className="h-4 w-4" />
                Define Your Audience
              </Badge>
            </div>

            {/* Left Side Overlay Panel - Desktop Only */}
            <div className="hidden lg:flex absolute left-4 top-4 bottom-4 w-80 flex-col gap-3 z-20 animate-fade-in overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {/* Header */}
              <div className="px-4 py-3 bg-background/80 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Audience Settings
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Define each vector sequentially
                </p>
              </div>

              {/* Vector Accordion */}
              <Accordion 
                type="single" 
                collapsible 
                value={activeAccordion}
                onValueChange={setActiveAccordion}
                className="space-y-2"
              >
                {allVectors.map((vector, index) => {
                  const isCompleted = completedVectors.has(index);
                  const isCurrent = currentVector === index;
                  const Icon = vector.icon;
                  
                  return (
                    <AccordionItem
                      key={vector.id}
                      value={vector.id}
                      className={`bg-background/70 backdrop-blur-xl border rounded-lg shadow-lg overflow-hidden animate-fade-in ${
                        isCurrent ? 'border-primary/50 ring-2 ring-primary/30' : 'border-primary/20'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <AccordionTrigger 
                        className="px-4 py-3 hover:bg-background/75 hover:no-underline"
                        onClick={() => setCurrentVector(index)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {isCompleted && (
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                          )}
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: vector.color }}
                          />
                          <span className="text-sm font-semibold text-foreground/90">
                            {vector.label}
                          </span>
                          <Badge variant="secondary" className="ml-auto text-[10px]">
                            {vector.category}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3 space-y-3">
                        {/* Dropdown Selection */}
                        <Select
                          value={selectedOptions[vector.id]}
                          onValueChange={(value) => setSelectedOptions({ ...selectedOptions, [vector.id]: value })}
                        >
                          <SelectTrigger className="w-full bg-background/50 border-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background/95 backdrop-blur-xl border-primary/20 z-50">
                            {vector.options.map((option) => (
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
                              backgroundColor: `${vector.color}20`,
                              color: vector.color,
                              borderColor: `${vector.color}40`
                            }}
                          >
                            {getImportanceLabel(importance[vector.id])}
                          </Badge>
                        </div>

                        {/* Tactile Slider with Steps */}
                        <div className="space-y-2">
                          <Slider
                            value={[importance[vector.id]]}
                            onValueChange={(value) => updateImportance(vector.id, value)}
                            max={100}
                            step={25}
                            className="w-full"
                          />
                          {/* Step Indicators */}
                          <div className="flex justify-between text-[10px] text-muted-foreground/60 px-1">
                            {importanceLevels.map(level => (
                              <span 
                                key={level.value}
                                className={importance[vector.id] === level.value ? 'text-primary font-semibold' : ''}
                              >
                                {level.label}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-2 pt-2">
                          {index > 0 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handlePrevious}
                              className="flex-1"
                            >
                              Previous
                            </Button>
                          )}
                          {index < 7 ? (
                            <Button 
                              size="sm" 
                              onClick={handleNext}
                              className="flex-1"
                            >
                              Next
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          ) : (
                            allCompleted && (
                              <Button 
                                size="sm" 
                                onClick={handleNext}
                                className="flex-1"
                              >
                                Continue
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            )
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>

            {/* Bottom Overlay Panel - Mobile Only - Single Question */}
            <div className="lg:hidden absolute bottom-0 left-0 right-0 z-20 animate-fade-in p-3 bg-gradient-to-t from-background/95 via-background/80 to-transparent backdrop-blur-xl pt-6">
              {(() => {
                const vector = allVectors[currentVector];
                const isCompleted = completedVectors.has(currentVector);
                
                return (
                  <div className="bg-background/70 backdrop-blur-xl border border-primary/50 ring-2 ring-primary/30 rounded-lg shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                              <Check className="h-2.5 w-2.5 text-primary" />
                            </div>
                          )}
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: vector.color }}
                          />
                          <span className="text-sm font-semibold text-foreground">
                            {vector.label}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">
                          {vector.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3 space-y-3">
                      {/* Dropdown Selection */}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          Select Option
                        </label>
                        <Select
                          value={selectedOptions[vector.id]}
                          onValueChange={(value) => setSelectedOptions({ ...selectedOptions, [vector.id]: value })}
                        >
                          <SelectTrigger className="w-full bg-background/50 border-primary/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background/95 backdrop-blur-xl border-primary/20 z-50">
                            {vector.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Importance Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">Importance Level</span>
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{ 
                              backgroundColor: `${vector.color}20`,
                              color: vector.color,
                            }}
                          >
                            {getImportanceLabel(importance[vector.id])}
                          </Badge>
                        </div>
                        <Slider
                          value={[importance[vector.id]]}
                          onValueChange={(value) => updateImportance(vector.id, value)}
                          max={100}
                          step={25}
                          className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground/60 px-1 mt-1">
                          {importanceLevels.map(level => (
                            <span 
                              key={level.value}
                              className={importance[vector.id] === level.value ? 'text-primary font-semibold' : ''}
                            >
                              {level.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-2 pt-2">
                        {currentVector > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handlePrevious}
                            className="flex-1"
                          >
                            <ArrowLeft className="mr-1 h-3 w-3" />
                            Previous
                          </Button>
                        )}
                        {currentVector < 7 ? (
                          <Button 
                            size="sm" 
                            onClick={handleNext}
                            className="flex-1"
                          >
                            Next
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        ) : (
                          allCompleted && (
                            <Button 
                              size="sm" 
                              onClick={handleNext}
                              className="flex-1"
                            >
                              Continue
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Instructions - Bottom Right */}
            <div className="absolute bottom-3 right-3 text-[10px] md:text-xs text-muted-foreground/60 z-10 bg-background/40 backdrop-blur-sm px-2 py-1 rounded">
              <p>Answer each question sequentially</p>
            </div>
          </div>
        </Card>

        {/* Navigation - Sticky on all screens */}
        <div className="sticky bottom-0 z-30 bg-background/80 backdrop-blur-lg border-t border-primary/10 -mx-2 md:-mx-4 px-4 py-3 mt-4">
          <div className="max-w-7xl mx-auto flex justify-between">
            <Button variant="outline" onClick={() => navigate("/p8/loc8")} className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>
            <Button 
              onClick={() => navigate("/p8/intgr8")} 
              className="group"
              disabled={!allCompleted}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P8Asl;
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadarChart } from "@/components/ui/radar-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Users, Brain } from "lucide-react";

// Combined vectors: 4 Demographics + 4 Psychographics
const allVectors = [
  // Demographics
  { 
    id: "age", 
    name: "Age Range",
    label: "Age Range", 
    category: "Demographics",
    options: [
      { value: "18-24", label: "18-24" },
      { value: "25-34", label: "25-34" },
      { value: "35-44", label: "35-44" },
      { value: "45-54", label: "45-54" },
      { value: "55+", label: "55+" },
    ],
    color: "#00eada",
    icon: Users 
  },
  { 
    id: "status", 
    name: "Professional Status",
    label: "Professional Status", 
    category: "Demographics",
    options: [
      { value: "student", label: "Student" },
      { value: "employee", label: "Employee" },
      { value: "entrepreneur", label: "Entrepreneur" },
      { value: "freelancer", label: "Freelancer" },
      { value: "executive", label: "Executive" },
    ],
    color: "#8b5cf6",
    icon: Users 
  },
  { 
    id: "gender", 
    name: "Gender",
    label: "Gender", 
    category: "Demographics",
    options: [
      { value: "all", label: "All" },
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "non-binary", label: "Non-binary" },
      { value: "prefer-not", label: "Prefer not to specify" },
    ],
    color: "#f97316",
    icon: Users 
  },
  { 
    id: "race", 
    name: "Ethnicity",
    label: "Ethnicity", 
    category: "Demographics",
    options: [
      { value: "all", label: "All" },
      { value: "asian", label: "Asian" },
      { value: "black", label: "Black" },
      { value: "hispanic", label: "Hispanic" },
      { value: "white", label: "White" },
      { value: "mixed", label: "Mixed" },
      { value: "other", label: "Other" },
    ],
    color: "#06b6d4",
    icon: Users 
  },
  // Psychographics
  {
    id: "interest",
    name: "Interest",
    label: "Interest",
    category: "Psychographics",
    options: [
      { value: "gaming", label: "Gaming" },
      { value: "technology", label: "Technology" },
      { value: "sports", label: "Sports" },
      { value: "arts", label: "Arts & Culture" },
      { value: "business", label: "Business" },
      { value: "health", label: "Health & Fitness" },
      { value: "entertainment", label: "Entertainment" },
      { value: "education", label: "Education" },
    ],
    color: "#3b82f6",
    icon: Brain
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    label: "Lifestyle",
    category: "Psychographics",
    options: [
      { value: "urban", label: "Urban" },
      { value: "suburban", label: "Suburban" },
      { value: "rural", label: "Rural" },
      { value: "nomadic", label: "Nomadic" },
      { value: "minimalist", label: "Minimalist" },
      { value: "luxury", label: "Luxury" },
      { value: "active", label: "Active" },
      { value: "relaxed", label: "Relaxed" },
    ],
    color: "#60a5fa",
    icon: Brain
  },
  {
    id: "values",
    name: "Values",
    label: "Values",
    category: "Psychographics",
    options: [
      { value: "innovation", label: "Innovation" },
      { value: "community", label: "Community" },
      { value: "sustainability", label: "Sustainability" },
      { value: "achievement", label: "Achievement" },
      { value: "creativity", label: "Creativity" },
      { value: "security", label: "Security" },
      { value: "freedom", label: "Freedom" },
      { value: "tradition", label: "Tradition" },
    ],
    color: "#2563eb",
    icon: Brain
  },
  {
    id: "attitudes",
    name: "Attitudes",
    label: "Attitudes",
    category: "Psychographics",
    options: [
      { value: "optimistic", label: "Optimistic" },
      { value: "pragmatic", label: "Pragmatic" },
      { value: "adventurous", label: "Adventurous" },
      { value: "cautious", label: "Cautious" },
      { value: "collaborative", label: "Collaborative" },
      { value: "independent", label: "Independent" },
      { value: "progressive", label: "Progressive" },
      { value: "conservative", label: "Conservative" },
    ],
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
  const [importance, setImportance] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("p8_combined_importance");
    if (saved) return JSON.parse(saved);
    return Object.fromEntries(allVectors.map(v => [v.id, 0]));
  });
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("p8_combined_options");
    if (saved) return JSON.parse(saved);
    return Object.fromEntries(allVectors.map(v => [v.id, v.options[0].value]));
  });
  const [completedVectors, setCompletedVectors] = useState<string[]>(() => {
    const saved = localStorage.getItem("p8_combined_progress");
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("p8_combined_importance", JSON.stringify(importance));
    localStorage.setItem("p8_combined_options", JSON.stringify(selectedOptions));
    localStorage.setItem("p8_combined_progress", JSON.stringify(completedVectors));
  }, [importance, selectedOptions, completedVectors]);

  const updateImportance = (vectorId: string, value: number[]) => {
    const snappedValue = importanceLevels.reduce((prev, curr) =>
      Math.abs(curr.value - value[0]) < Math.abs(prev.value - value[0])
        ? curr
        : prev
    ).value;

    setImportance((prev) => ({ ...prev, [vectorId]: snappedValue }));

    if (snappedValue > 0 && !completedVectors.includes(vectorId)) {
      setCompletedVectors((prev) => [...prev, vectorId]);
      
      // Auto-advance to next vector if not the last one
      const currentIndex = allVectors.findIndex((v) => v.id === vectorId);
      if (currentIndex < allVectors.length - 1) {
        setTimeout(() => {
          setCurrentVector(currentIndex + 1);
        }, 500);
      }
    }
  };

  const handlePrevious = () => {
    if (currentVector > 0) {
      setCurrentVector(currentVector - 1);
    }
  };

  const handleNext = () => {
    if (currentVector < allVectors.length - 1) {
      setCurrentVector(currentVector + 1);
    }
  };

  const handleOptionChange = (vectorId: string, optionValue: string) => {
    setSelectedOptions((prev) => ({ ...prev, [vectorId]: optionValue }));
  };

  // Generate radar chart data
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

  const getImportanceLabel = (value: number) => {
    return (
      importanceLevels.find((level) => level.value === value)?.label || "Not Set"
    );
  };

  const currentVectorData = allVectors[currentVector];
  const currentStep = currentVector < 4 ? 2 : 3;
  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-secondary/30 h-2">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(completedVectors.length / allVectors.length) * 100}%` }}
        />
      </div>

      {/* Main Content - Centered Radar Chart */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 pb-48 md:pb-56">
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <RadarChart
            data={radarData}
            width={500}
            height={500}
            activeVector={currentVector}
            completedVectors={new Set(completedVectors.map(id => 
              allVectors.findIndex(v => v.id === id)
            ))}
          />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Importance</p>
            <p className="text-3xl font-bold text-primary">{totalImportance}</p>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-primary/20 shadow-2xl z-50">
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4">
          {/* Header Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground px-2 py-1 rounded-md bg-primary/10">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm md:text-base font-semibold">
              Question {currentVector + 1} of {allVectors.length}: {currentVectorData.name}
            </span>
            <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-secondary/50">
              {currentVector < 4 ? "Demographics" : "Psychographics"}
            </span>
          </div>

          {/* Control Row */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr,auto] gap-4 items-end">
            {/* Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Select Option
              </label>
              <Select
                value={selectedOptions[currentVectorData.id] || ""}
                onValueChange={(value) => handleOptionChange(currentVectorData.id, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an option..." />
                </SelectTrigger>
                <SelectContent>
                  {currentVectorData.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Importance Slider */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Importance Level: {" "}
                <span style={{ color: currentVectorData.color }} className="font-semibold">
                  {getImportanceLabel(importance[currentVectorData.id] || 0)}
                </span>
              </label>
              <div className="space-y-1">
                <Slider
                  value={[importance[currentVectorData.id] || 0]}
                  onValueChange={(value) =>
                    updateImportance(currentVectorData.id, value)
                  }
                  max={100}
                  step={25}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>Important</span>
                  <span>Critical</span>
                  <span>Essential</span>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={currentVector === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentVector === allVectors.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-1.5 pt-2">
            {allVectors.map((vector, index) => (
              <button
                key={vector.id}
                onClick={() => setCurrentVector(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentVector
                    ? "w-6 bg-primary"
                    : completedVectors.includes(vector.id)
                    ? "bg-primary/60"
                    : "bg-border"
                }`}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between gap-4 pt-2 border-t border-primary/10">
            <Button variant="ghost" onClick={() => navigate("/p8/loc8")}>
              Back
            </Button>
            <Button
              onClick={() => navigate("/p8/intgr8")}
              disabled={completedVectors.length < allVectors.length}
              className="min-w-32"
            >
              {completedVectors.length === allVectors.length ? "Continue" : `Complete ${allVectors.length - completedVectors.length} more`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P8Asl;

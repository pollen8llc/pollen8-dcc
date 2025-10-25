import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadarChart } from "@/components/ui/radar-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, RotateCcw } from "lucide-react";

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
    color: "#3b82f6",
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
    color: "#3b82f6",
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
    color: "#3b82f6",
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
    color: "#3b82f6",
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
    color: "#3b82f6",
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
    color: "#3b82f6",
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
    color: "#3b82f6",
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
  const [selectedVector, setSelectedVector] = useState<number | null>(null);
  const [importance, setImportance] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("p8_combined_importance");
    if (saved) return JSON.parse(saved);
    return Object.fromEntries(allVectors.map(v => [v.id, 40]));
  });
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem("p8_combined_options");
    if (saved) return JSON.parse(saved);
    // Start with empty strings to allow users to select any option including "all"
    return Object.fromEntries(allVectors.map(v => [v.id, ""]));
  });
  const [stage1Complete, setStage1Complete] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("p8_stage1_complete");
    if (saved) return new Set(JSON.parse(saved));
    return new Set();
  });
  const [stage2Complete, setStage2Complete] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("p8_stage2_complete");
    if (saved) return new Set(JSON.parse(saved));
    return new Set();
  });
  const [pulsingNode, setPulsingNode] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragImportance, setDragImportance] = useState(0);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("p8_combined_importance", JSON.stringify(importance));
    localStorage.setItem("p8_combined_options", JSON.stringify(selectedOptions));
    localStorage.setItem("p8_stage1_complete", JSON.stringify(Array.from(stage1Complete)));
    localStorage.setItem("p8_stage2_complete", JSON.stringify(Array.from(stage2Complete)));
  }, [importance, selectedOptions, stage1Complete, stage2Complete]);

  const handleReset = () => {
    const resetImportance = Object.fromEntries(allVectors.map(v => [v.id, 40]));
    const resetOptions = Object.fromEntries(allVectors.map(v => [v.id, v.options[0].value]));
    
    setImportance(resetImportance);
    setSelectedOptions(resetOptions);
    setStage1Complete(new Set());
    setStage2Complete(new Set());
    setPulsingNode(null);
    setSelectedVector(null);
    
    localStorage.removeItem("p8_combined_importance");
    localStorage.removeItem("p8_combined_options");
    localStorage.removeItem("p8_stage1_complete");
    localStorage.removeItem("p8_stage2_complete");
  };

  const handleNodeClick = (index: number) => {
    const vectorId = allVectors[index].id;
    
    // Always allow clicking to open the modal
    setSelectedVector(index);
  };

  const handleNodeDrag = (index: number, newImportance: number) => {
    const vectorId = allVectors[index].id;
    setImportance((prev) => ({ ...prev, [vectorId]: newImportance }));

    // Mark Stage 2 as complete (only if Stage 1 is complete and importance > 0)
    if (stage1Complete.has(vectorId) && newImportance > 0) {
      setStage2Complete(prev => new Set(prev).add(vectorId));
      setPulsingNode(null);
    }
    
    setIsDragging(false);
  };

  const handleDragUpdate = (importance: number) => {
    setDragImportance(importance);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleOptionChange = (vectorId: string, optionValue: string) => {
    setSelectedOptions((prev) => ({ ...prev, [vectorId]: optionValue }));
    
    // Mark Stage 1 as complete
    setStage1Complete(prev => new Set(prev).add(vectorId));
    
    // Set this node as pulsing
    setPulsingNode(selectedVector);
    
    // Close modal after short delay
    setTimeout(() => setSelectedVector(null), 300);
  };

  // Generate radar chart data
  const radarData = useMemo(() => {
    return allVectors.map(vector => ({
      category: vector.label,
      id: vector.id,
      importance: importance[vector.id] || 0,
      color: vector.color,
    }));
  }, [importance]);

  // Calculate total importance
  const totalImportance = useMemo(() => {
    return Object.values(importance).reduce((sum, val) => sum + val, 0);
  }, [importance]);

  const allCompleted = stage2Complete.size === allVectors.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center pb-24 relative">
      {/* Progress Badge */}
      <div className="absolute top-8 left-8">
        <Badge variant="outline" className="backdrop-blur-sm bg-primary/10 text-primary border-primary/30">
          Step 3 of 4
        </Badge>
      </div>

      {/* Centered Radar Chart */}
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl px-4">
        {/* Instructions */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Click nodes to configure • Drag to set importance
          </p>
        </div>

        <div className="w-full max-w-md">
          <RadarChart
            data={radarData}
            width={420}
            height={420}
            stage1Complete={stage1Complete}
            stage2Complete={stage2Complete}
            pulsingNode={pulsingNode}
            onNodeClick={handleNodeClick}
            onNodeDrag={handleNodeDrag}
            onDragUpdate={handleDragUpdate}
            onDragStart={handleDragStart}
          />
        </div>
        
      </div>

      {/* Pulsing Node Instruction - Above Nav Bar */}
      {pulsingNode !== null && !isDragging && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 pointer-events-none z-30 animate-fade-in">
          <div className="px-6 py-3 rounded-full backdrop-blur-md bg-primary/20 border border-primary/40">
            <p className="text-sm font-medium text-primary">
              Drag the pulsing node to set importance
            </p>
          </div>
        </div>
      )}

      {/* Glassmorphic Option Modal */}
      {selectedVector !== null && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVector(null)}
        >
          <div 
            className="bg-background/95 backdrop-blur-lg border border-primary/20 rounded-3xl p-8 shadow-2xl max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {allVectors[selectedVector].name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {allVectors[selectedVector].category}
              </p>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-muted-foreground">
                Select your option
              </label>
              <Select
                value={selectedOptions[allVectors[selectedVector].id] || ""}
                onValueChange={(value) => handleOptionChange(allVectors[selectedVector].id, value)}
              >
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder="Choose an option..." />
                </SelectTrigger>
                <SelectContent>
                  {allVectors[selectedVector].options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-base py-3">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-6">
              After selecting, drag the node closer or further from the center to set importance
            </p>
          </div>
        </div>
      )}

      {/* Importance Indicator - Above Nav Bar */}
      {(isDragging || (selectedVector !== null && stage1Complete.has(allVectors[selectedVector].id))) && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 animate-fade-in">
          <div 
            className="backdrop-blur-md border rounded-full px-6 py-3 shadow-lg transition-all duration-300"
            style={{
              backgroundColor: isDragging 
                ? `rgb(${59 + (20 - 59) * (dragImportance / 100)}, ${130 + (184 - 130) * (dragImportance / 100)}, ${246 + (166 - 246) * (dragImportance / 100)}, 0.2)`
                : selectedVector !== null && stage1Complete.has(allVectors[selectedVector].id)
                  ? `rgb(${59 + (20 - 59) * (importance[allVectors[selectedVector].id] / 100)}, ${130 + (184 - 130) * (importance[allVectors[selectedVector].id] / 100)}, ${246 + (166 - 246) * (importance[allVectors[selectedVector].id] / 100)}, 0.2)`
                  : 'rgba(59, 130, 246, 0.2)',
              borderColor: isDragging 
                ? `rgb(${59 + (20 - 59) * (dragImportance / 100)}, ${130 + (184 - 130) * (dragImportance / 100)}, ${246 + (166 - 246) * (dragImportance / 100)}, 0.3)`
                : selectedVector !== null && stage1Complete.has(allVectors[selectedVector].id)
                  ? `rgb(${59 + (20 - 59) * (importance[allVectors[selectedVector].id] / 100)}, ${130 + (184 - 130) * (importance[allVectors[selectedVector].id] / 100)}, ${246 + (166 - 246) * (importance[allVectors[selectedVector].id] / 100)}, 0.3)`
                  : 'rgba(59, 130, 246, 0.3)'
            }}
          >
            <p 
              className="text-base font-semibold transition-colors duration-300"
              style={{
                color: isDragging 
                  ? `rgb(${59 + (20 - 59) * (dragImportance / 100)}, ${130 + (184 - 130) * (dragImportance / 100)}, ${246 + (166 - 246) * (dragImportance / 100)})`
                  : selectedVector !== null && stage1Complete.has(allVectors[selectedVector].id)
                    ? `rgb(${59 + (20 - 59) * (importance[allVectors[selectedVector].id] / 100)}, ${130 + (184 - 130) * (importance[allVectors[selectedVector].id] / 100)}, ${246 + (166 - 246) * (importance[allVectors[selectedVector].id] / 100)})`
                    : 'rgb(59, 130, 246)'
              }}
            >
              {isDragging 
                ? `Importance: ${Math.round(dragImportance / 10)}/10`
                : selectedVector !== null && stage1Complete.has(allVectors[selectedVector].id)
                  ? `Importance: ${Math.round(importance[allVectors[selectedVector].id] / 10)}/10`
                  : "Importance: -"}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-lg border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => navigate("/p8/loc8")}
            className="group"
          >
            Back
          </Button>

          {/* Center Section - Indicators */}
          <div className="flex items-center gap-3">
            {/* Reset Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-9"
              title="Reset all selections"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            {/* Completion Counter */}
            <div className="backdrop-blur-md bg-background/30 border border-primary/20 rounded-full px-4 py-2">
              <p className="text-sm font-medium text-foreground/80">
                {stage2Complete.size} / {allVectors.length}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <Button
            onClick={() => navigate("/p8/tags")}
            disabled={!allCompleted}
            className="group"
          >
            Continue
            <Check className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default P8Asl;

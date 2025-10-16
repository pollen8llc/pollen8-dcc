import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadarChart } from "@/components/ui/radar-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

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
    color: "#60a5fa",
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

  const handleNodeClick = (index: number) => {
    setSelectedVector(index);
  };

  const handleNodeDrag = (index: number, newImportance: number) => {
    const vectorId = allVectors[index].id;
    setImportance((prev) => ({ ...prev, [vectorId]: newImportance }));

    if (newImportance > 0 && !completedVectors.includes(vectorId)) {
      setCompletedVectors((prev) => [...prev, vectorId]);
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

  const allCompleted = completedVectors.length === allVectors.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-8 relative">
      {/* Centered Radar Chart */}
      <div className="flex flex-col items-center gap-8">
        <RadarChart
          data={radarData}
          width={600}
          height={600}
          completedVectors={new Set(completedVectors.map(id => 
            allVectors.findIndex(v => v.id === id)
          ))}
          onNodeClick={handleNodeClick}
          onNodeDrag={handleNodeDrag}
        />
        
        {/* Center Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-background/95 backdrop-blur-lg border border-primary/20 rounded-2xl px-6 py-4 shadow-2xl text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {allCompleted ? "All Vectors Complete!" : "Click nodes to configure"}
            </p>
            <p className="text-2xl font-bold text-primary">{completedVectors.length} / {allVectors.length}</p>
          </div>
        </div>
      </div>

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
                onValueChange={(value) => {
                  handleOptionChange(allVectors[selectedVector].id, value);
                  setTimeout(() => setSelectedVector(null), 300);
                }}
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

      {/* Continue Button */}
      {allCompleted && (
        <Button
          onClick={() => navigate("/p8/intgr8")}
          size="lg"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 min-w-48 animate-fade-in shadow-2xl"
        >
          <Check className="mr-2 h-5 w-5" />
          Continue
        </Button>
      )}

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/p8/loc8")}
        className="fixed top-8 left-8"
      >
        Back
      </Button>
    </div>
  );
};

export default P8Asl;

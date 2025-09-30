import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const demographics = [
  { id: "age", label: "Age Range", options: ["18-24", "25-34", "35-44", "45-54", "55+"] },
  { id: "status", label: "Professional Status", options: ["Student", "Employee", "Entrepreneur", "Freelancer", "Executive"] },
  { id: "gender", label: "Gender", options: ["All", "Male", "Female", "Non-binary", "Prefer not to specify"] },
  { id: "race", label: "Ethnicity", options: ["All", "Asian", "Black", "Hispanic", "White", "Mixed", "Other"] },
];

const P8Asl = () => {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [importance, setImportance] = useState<Record<string, number>>({
    age: 50,
    status: 50,
    gender: 50,
    race: 50,
  });

  const toggleOption = (categoryId: string, option: string) => {
    const current = selections[categoryId] || [];
    const newSelection = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setSelections({ ...selections, [categoryId]: newSelection });
  };

  const updateImportance = (categoryId: string, value: number[]) => {
    setImportance({ ...importance, [categoryId]: value[0] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* Progress */}
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 2 of 4
          </Badge>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Define Your Demographics</h1>
          <p className="text-muted-foreground">Who are you trying to reach?</p>
        </div>

        {/* Demographics Grid */}
        <div className="space-y-6">
          {demographics.map((category, index) => (
            <Card
              key={category.id}
              className="p-6 bg-background/40 backdrop-blur-xl border-primary/20 space-y-4 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{category.label}</h3>
                <Badge variant="secondary" className={`${importance[category.id] > 70 ? "bg-primary/20 text-primary" : ""}`}>
                  {importance[category.id] > 70 ? "High" : importance[category.id] > 40 ? "Medium" : "Low"} Priority
                </Badge>
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-2">
                {category.options.map((option) => {
                  const isSelected = selections[category.id]?.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleOption(category.id, option)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105 ${
                        isSelected
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-background/60 border-border hover:border-primary/40"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Importance Slider */}
              <div className="space-y-2 pt-2">
                <label className="text-sm text-muted-foreground">Importance Level</label>
                <Slider
                  value={[importance[category.id]]}
                  onValueChange={(value) => updateImportance(category.id, value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/p8/loc8")} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <Button onClick={() => navigate("/p8/class")} className="group">
            Continue
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default P8Asl;

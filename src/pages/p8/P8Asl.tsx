import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const demographics = [
  { id: "age", label: "Age Range", options: ["18-24", "25-34", "35-44", "45-54", "55+"], color: "#00eada" },
  { id: "status", label: "Professional Status", options: ["Student", "Employee", "Entrepreneur", "Freelancer", "Executive"], color: "#8b5cf6" },
  { id: "gender", label: "Gender", options: ["All", "Male", "Female", "Non-binary", "Prefer not to specify"], color: "#f97316" },
  { id: "race", label: "Ethnicity", options: ["All", "Asian", "Black", "Hispanic", "White", "Mixed", "Other"], color: "#06b6d4" },
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
  const [importance, setImportance] = useState<Record<string, number>>({
    age: 50,
    status: 50,
    gender: 50,
    race: 50,
  });

  const updateImportance = (categoryId: string, value: number[]) => {
    // Snap to nearest step
    const snappedValue = Math.round(value[0] / 25) * 25;
    setImportance({ ...importance, [categoryId]: snappedValue });
  };

  // Generate chart data based on importance levels
  const chartData = useMemo(() => {
    return demographics.map(demo => ({
      name: demo.label,
      value: importance[demo.id] || 0,
      color: demo.color,
    })).filter(d => d.value > 0);
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
            Step 2 of 4
          </Badge>
        </div>

        {/* Canvas Container */}
        <Card className="p-2 md:p-4 bg-background/20 backdrop-blur-sm border-primary/10">
          <div className="relative w-full h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] max-h-[700px] rounded-lg overflow-hidden bg-gradient-to-br from-background/10 via-primary/5 to-primary/10">
            
            {/* Center Chart */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-md h-full flex flex-col items-center justify-center p-4">
                {chartData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="70%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background) / 0.9)',
                            border: '1px solid hsl(var(--primary) / 0.2)',
                            borderRadius: '8px',
                            backdropFilter: 'blur(12px)',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center mt-4 bg-background/70 backdrop-blur-xl px-6 py-3 rounded-lg border border-primary/20 shadow-lg">
                      <p className="text-sm text-muted-foreground">Total Priority Score</p>
                      <p className="text-3xl font-bold text-primary">{totalImportance}</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4 bg-background/70 backdrop-blur-xl px-8 py-12 rounded-lg border border-primary/20 shadow-lg">
                    <Users className="h-16 w-16 text-primary/60 mx-auto" />
                    <h3 className="text-xl font-semibold text-foreground/90">Configure Your Demographics</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Adjust the importance sliders to define your target audience. The chart will update dynamically.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Header - Mobile only */}
            <div className="lg:hidden absolute top-3 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
              <Badge className="bg-background/80 backdrop-blur-md border-primary/20 text-primary px-4 py-2 text-sm flex items-center gap-2 shadow-lg">
                <Users className="h-4 w-4" />
                Define Demographics
              </Badge>
            </div>

            {/* Left Side Overlay Panel - Desktop Only */}
            <div className="hidden lg:flex absolute left-4 top-4 bottom-4 w-80 flex-col gap-3 z-20 animate-fade-in overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {/* Header */}
              <div className="px-4 py-3 bg-background/80 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Demographic Settings
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Adjust importance levels for each category
                </p>
              </div>

              {/* Demographic Controls */}
              {demographics.map((category, index) => (
                <div
                  key={category.id}
                  className="px-4 py-3 bg-background/70 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg space-y-3 transition-all hover:bg-background/75 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <h4 className="text-sm font-semibold text-foreground/90">
                        {category.label}
                      </h4>
                    </div>
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
                </div>
              ))}
            </div>

            {/* Bottom Overlay Panel - Mobile Only */}
            <div className="lg:hidden absolute bottom-0 left-0 right-0 z-20 animate-fade-in p-3 space-y-2 bg-gradient-to-t from-background/95 via-background/80 to-transparent backdrop-blur-xl pt-6 max-h-[45vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {demographics.map((category, index) => (
                <div
                  key={category.id}
                  className="px-3 py-2.5 bg-background/70 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg space-y-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <h4 className="text-xs font-semibold text-foreground/90">
                        {category.label}
                      </h4>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] px-2 py-0.5"
                      style={{ 
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                      }}
                    >
                      {getImportanceLabel(importance[category.id])}
                    </Badge>
                  </div>

                  {/* Tactile Slider */}
                  <Slider
                    value={[importance[category.id]]}
                    onValueChange={(value) => updateImportance(category.id, value)}
                    max={100}
                    step={25}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            {/* Instructions - Bottom Right */}
            <div className="absolute bottom-3 right-3 text-[10px] md:text-xs text-muted-foreground/60 z-10 bg-background/40 backdrop-blur-sm px-2 py-1 rounded">
              <p>Slide to adjust importance</p>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between px-2">
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

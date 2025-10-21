import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const P8 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("p8_community_name");
    const savedDescription = localStorage.getItem("p8_community_description");
    const savedWebsite = localStorage.getItem("p8_community_website");
    
    if (savedName || savedDescription || savedWebsite) {
      setFormData({
        name: savedName || "",
        description: savedDescription || "",
        website: savedWebsite || "",
      });
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (formData.name) localStorage.setItem("p8_community_name", formData.name);
    if (formData.description) localStorage.setItem("p8_community_description", formData.description);
    if (formData.website) localStorage.setItem("p8_community_website", formData.website);
  }, [formData]);

  const isValid = formData.name.trim().length > 0;

  const handleContinue = () => {
    if (isValid) {
      navigate("/p8/loc8");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-3 md:space-y-4 animate-fade-in p-2 md:p-4">
        {/* Progress */}
        <div className="flex items-center space-x-2 px-2">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 1 of 4
          </Badge>
        </div>

        {/* Main Form - Glassmorphic */}
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            {/* Title */}
            <div className="text-center mb-8 space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Community Builder
              </h1>
              <p className="text-muted-foreground text-lg">
                Let's start by defining your community's core identity
              </p>
            </div>

            {/* Glassmorphic Form Card */}
            <div className="backdrop-blur-lg bg-background/50 border border-primary/20 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
              {/* Community Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Community Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Tech Innovators Network"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 text-base bg-background/60"
                />
              </div>

              {/* Community Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                  Community Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your community's mission, values, and what makes it unique..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[120px] text-base bg-background/60 resize-none"
                />
              </div>

              {/* Community Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="text-base font-medium">
                  Community Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourcommunity.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="h-12 text-base bg-background/60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Sticky */}
        <div className="sticky bottom-0 z-30 bg-background/80 backdrop-blur-lg border-t border-primary/10 -mx-2 md:-mx-4 px-4 py-3 mt-4">
          <div className="max-w-7xl mx-auto flex justify-between">
            <Button variant="outline" onClick={() => navigate("/builder")} className="group">
              Back
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={!isValid}
              className="group"
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

export default P8;

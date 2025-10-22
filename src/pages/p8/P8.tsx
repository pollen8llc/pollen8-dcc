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
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Progress Badge */}
        <div className="mb-6">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 1 of 4
          </Badge>
        </div>

        {/* Centered Form Fields */}
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-full max-w-2xl space-y-8 animate-fade-in">
            {/* Title */}
            <div className="text-center mb-12 space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Community Builder
              </h1>
              <p className="text-muted-foreground text-lg">
                Let's start by defining your community's core identity
              </p>
            </div>

            {/* Community Name Field */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-medium pl-4">
                Community Name <span className="text-destructive">*</span>
              </Label>
              <div className="glass dark:glass-dark rounded-full shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                <Input
                  id="name"
                  placeholder="e.g., Tech Innovators Network"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-14 text-base bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-6"
                />
              </div>
            </div>

            {/* Community Description Field */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-medium pl-4">
                Community Description
              </Label>
              <div className="glass dark:glass-dark rounded-3xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                <Textarea
                  id="description"
                  placeholder="Describe your community's mission, values, and what makes it unique..."
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    // Auto-expand textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.max(120, e.target.scrollHeight)}px`;
                  }}
                  className="min-h-[120px] text-base bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-6 py-4 resize-none"
                  style={{ height: '120px' }}
                />
              </div>
            </div>

            {/* Community Website Field */}
            <div className="space-y-3">
              <Label htmlFor="website" className="text-base font-medium pl-4">
                Community Website
              </Label>
              <div className="glass dark:glass-dark rounded-full shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourcommunity.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="h-14 text-base bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Sticky */}
        <div className="sticky bottom-0 z-30 bg-background/80 backdrop-blur-lg border-t border-primary/10 -mx-4 px-4 py-3 mt-4">
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

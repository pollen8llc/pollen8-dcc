import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, FileText, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 240) {
      setFormData({ ...formData, description: value });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Progress Badge */}
        <div className="mb-8">
          <Badge variant="outline" className="backdrop-blur-sm bg-primary/10 text-primary border-primary/30">
            Step 1 of 4
          </Badge>
        </div>

        {/* Centered Content */}
        <div className="min-h-[calc(100vh-300px)] flex items-center justify-center">
          <div className="w-full max-w-2xl space-y-8 animate-fade-in">
            {/* Community Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground/70 pl-2">
                Community Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  placeholder="e.g., Tech Innovators Network"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-14 pr-6 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base h-14 font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all focus:outline-none focus:ring-0"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            {/* Community Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground/70 pl-2">
                Community Description <span className="text-muted-foreground text-xs">({formData.description.length}/240)</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-6 top-6 h-5 w-5 text-primary z-10 pointer-events-none" />
                <textarea
                  id="description"
                  placeholder="Describe your community's mission, values, and what makes it unique..."
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  maxLength={240}
                  rows={2}
                  className="w-full pl-14 pr-6 py-4 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all resize-none focus:outline-none focus:ring-0"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            {/* Community Website Field */}
            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium text-foreground/70 pl-2">
                Community Website
              </label>
              <div className="relative">
                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10 pointer-events-none" />
                <input
                  id="website"
                  type="url"
                  placeholder="https://yourcommunity.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full pl-14 pr-6 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base h-14 font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all focus:outline-none focus:ring-0"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Sticky Bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-lg bg-background/80 border-t border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <Button 
                variant="outline" 
                onClick={() => navigate("/builder")}
                className="hover-scale"
              >
                Back
              </Button>
              <Button 
                onClick={handleContinue}
                disabled={!isValid}
                className="group hover-scale"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P8;

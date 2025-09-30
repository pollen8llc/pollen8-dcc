import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const suggestedApps = [
  { id: "discord", name: "Discord", category: "Communication", logo: "🎮" },
  { id: "eventbrite", name: "Eventbrite", category: "Events", logo: "🎫" },
  { id: "mailchimp", name: "Mailchimp", category: "Email", logo: "📧" },
];

const allApps = [
  { id: "slack", name: "Slack", category: "Communication", logo: "💬" },
  { id: "notion", name: "Notion", category: "Knowledge", logo: "📝" },
  { id: "zoom", name: "Zoom", category: "Video", logo: "📹" },
  { id: "stripe", name: "Stripe", category: "Payments", logo: "💳" },
  { id: "luma", name: "Luma", category: "Events", logo: "✨" },
  { id: "circle", name: "Circle", category: "Community", logo: "⭕" },
  { id: "memberstack", name: "Memberstack", category: "Membership", logo: "👥" },
  { id: "airtable", name: "Airtable", category: "Database", logo: "📊" },
  { id: "typeform", name: "Typeform", category: "Forms", logo: "📋" },
  { id: "calendly", name: "Calendly", category: "Scheduling", logo: "📅" },
  { id: "twitter", name: "Twitter/X", category: "Social", logo: "🐦" },
  { id: "linkedin", name: "LinkedIn", category: "Social", logo: "💼" },
];

const P8Intgr8 = () => {
  const navigate = useNavigate();
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  const toggleApp = (id: string) => {
    setSelectedApps((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const filteredApps = allApps.filter(
    (app) =>
      app.name.toLowerCase().includes(filter.toLowerCase()) ||
      app.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in p-6">
        {/* Progress */}
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 4 of 4
          </Badge>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Tech Stack Integration</h1>
          <p className="text-muted-foreground">Connect your existing tools or explore recommendations</p>
        </div>

        {/* Suggested Apps */}
        <Card className="p-6 bg-background/40 backdrop-blur-xl border-primary/20 space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Badge variant="secondary" className="mr-2 bg-primary/20 text-primary">Recommended</Badge>
            Suggested for your network
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedApps.map((app) => {
              const isSelected = selectedApps.includes(app.id);
              return (
                <button
                  key={app.id}
                  onClick={() => toggleApp(app.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? "bg-primary/20 border-primary shadow-lg shadow-primary/20"
                      : "bg-background/60 border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{app.logo}</span>
                    {isSelected && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="font-medium text-left">{app.name}</p>
                  <p className="text-sm text-muted-foreground text-left">{app.category}</p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* All Apps Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">All Integrations</h3>
            <Input
              placeholder="Filter by name or category..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xs bg-background/60 backdrop-blur-xl border-primary/20"
            />
          </div>

          <Card className="p-6 bg-background/40 backdrop-blur-xl border-primary/20">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredApps.map((app) => {
                const isSelected = selectedApps.includes(app.id);
                return (
                  <button
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? "bg-primary/20 border-primary"
                        : "bg-background/60 border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{app.logo}</span>
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium truncate">{app.name}</p>
                        <p className="text-xs text-muted-foreground">{app.category}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Selected Count */}
        {selectedApps.length > 0 && (
          <Card className="p-4 bg-primary/10 backdrop-blur-xl border-primary/30 animate-fade-in">
            <p className="text-center text-sm">
              <span className="font-semibold text-primary">{selectedApps.length}</span> integration
              {selectedApps.length !== 1 && "s"} selected
            </p>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/p8/class")} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <Button onClick={() => navigate("/p8/dashboard")} className="group">
            View Dashboard
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default P8Intgr8;

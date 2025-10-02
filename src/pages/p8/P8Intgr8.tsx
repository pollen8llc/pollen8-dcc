import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, MessageSquare, Calendar, Mail, MessageCircle, FileText, Video, CreditCard, Sparkles, CircleDot, Users, Database, ClipboardList, CalendarClock, Twitter, Linkedin, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface App {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
}

const suggestedApps: App[] = [
  { id: "discord", name: "Discord", category: "Communication", icon: MessageSquare },
  { id: "eventbrite", name: "Eventbrite", category: "Events", icon: Calendar },
  { id: "mailchimp", name: "Mailchimp", category: "Email", icon: Mail },
];

const allApps: App[] = [
  { id: "slack", name: "Slack", category: "Communication", icon: MessageCircle },
  { id: "notion", name: "Notion", category: "Knowledge", icon: FileText },
  { id: "zoom", name: "Zoom", category: "Video", icon: Video },
  { id: "stripe", name: "Stripe", category: "Payments", icon: CreditCard },
  { id: "luma", name: "Luma", category: "Events", icon: Sparkles },
  { id: "circle", name: "Circle", category: "Community", icon: CircleDot },
  { id: "memberstack", name: "Memberstack", category: "Membership", icon: Users },
  { id: "airtable", name: "Airtable", category: "Database", icon: Database },
  { id: "typeform", name: "Typeform", category: "Forms", icon: ClipboardList },
  { id: "calendly", name: "Calendly", category: "Scheduling", icon: CalendarClock },
  { id: "twitter", name: "Twitter/X", category: "Social", icon: Twitter },
  { id: "linkedin", name: "LinkedIn", category: "Social", icon: Linkedin },
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-6">
        {/* Progress Badge */}
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="glass-morphism border-primary/30 text-primary">
            Step 4 of 4
          </Badge>
        </div>

        {/* Glassmorphic Header */}
        <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20 text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Tech Stack Integration
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect your existing tools or explore recommendations
          </p>
        </div>

        {/* Suggested Apps Panel */}
        <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20 space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant="teal" className="shadow-lg shadow-primary/20">
              Recommended
            </Badge>
            <h3 className="text-xl font-semibold">Suggested for your network</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestedApps.map((app) => {
              const isSelected = selectedApps.includes(app.id);
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => toggleApp(app.id)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? "glass-morphism border-primary shadow-lg shadow-primary/30 bg-primary/10"
                      : "glass-morphism border-white/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      isSelected 
                        ? "bg-primary/20 shadow-lg shadow-primary/30" 
                        : "bg-primary/10 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/20"
                    }`}>
                      <Icon className={`h-8 w-8 ${isSelected ? "text-primary" : "text-primary/80 group-hover:text-primary"}`} />
                    </div>
                    {isSelected && (
                      <div className="p-1.5 rounded-full bg-primary/20">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-left">
                    <Badge variant="outline" className="border-primary/30">
                      {app.name}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{app.category}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* All Integrations Panel */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">All Integrations</h3>
            <Input
              placeholder="Filter by name or category..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xs glass-morphism border-primary/20 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/20 transition-all duration-300"
            />
          </div>

          <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 border border-primary/20">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredApps.map((app) => {
                const isSelected = selectedApps.includes(app.id);
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className={`group relative p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                      isSelected
                        ? "glass-morphism border-primary shadow-lg shadow-primary/30 bg-primary/10"
                        : "glass-morphism border-white/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          isSelected 
                            ? "bg-primary/20 shadow-lg shadow-primary/30" 
                            : "bg-primary/10 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/20"
                        }`}>
                          <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-primary/80 group-hover:text-primary"}`} />
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 p-1 rounded-full bg-primary/20">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="text-left space-y-1">
                        <Badge variant="outline" className="text-xs border-primary/30 truncate w-full justify-start">
                          {app.name}
                        </Badge>
                        <p className="text-xs text-muted-foreground truncate">{app.category}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Count */}
        {selectedApps.length > 0 && (
          <div className="glass-morphism glass-morphism-hover rounded-2xl p-6 border border-primary/30 animate-fade-in shadow-lg shadow-primary/20">
            <p className="text-center text-sm">
              <span className="font-semibold text-primary text-lg">{selectedApps.length}</span>
              {" "}integration{selectedApps.length !== 1 && "s"} selected
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pb-8">
          <Button variant="outline" onClick={() => navigate("/p8/class")} className="group glass-morphism hover:shadow-lg hover:shadow-primary/20">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <Button onClick={() => navigate("/p8/dashboard")} className="group shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40">
            View Dashboard
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default P8Intgr8;

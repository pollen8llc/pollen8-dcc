import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, MessageSquare, Calendar, Mail, MessageCircle, FileText, Video, CreditCard, Sparkles, CircleDot, Users, Database, ClipboardList, CalendarClock, Twitter, Linkedin, LucideIcon, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface App {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
}

const categoryColors: Record<string, string> = {
  Communication: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  Events: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  Email: "bg-primary/20 text-primary border-primary/50",
  Video: "bg-white/20 text-white border-white/50",
  Payments: "bg-white/20 text-white border-white/50",
  Knowledge: "bg-white/20 text-white border-white/50",
  Community: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  Membership: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  Database: "bg-primary/20 text-primary border-primary/50",
  Forms: "bg-white/20 text-white border-white/50",
  Scheduling: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  Social: "bg-blue-500/20 text-blue-400 border-blue-500/50",
};

const allApps: App[] = [
  { id: "discord", name: "Discord", category: "Communication", icon: MessageSquare },
  { id: "eventbrite", name: "Eventbrite", category: "Events", icon: Calendar },
  { id: "mailchimp", name: "Mailchimp", category: "Email", icon: Mail },
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
  const [selectedApps, setSelectedApps] = useState<string[]>(["discord", "eventbrite", "mailchimp"]);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(allApps.map(app => app.category)))];

  const toggleApp = (id: string) => {
    setSelectedApps((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const filteredApps = allApps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(filter.toLowerCase()) ||
      app.category.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = categoryFilter === "all" || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-6">
        {/* Minimal Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Select your stack</h1>
          <p className="text-sm text-muted-foreground">Step 4 of 4</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 bg-card/80 backdrop-blur-sm border-primary/20 focus:border-primary/50"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-card/80 backdrop-blur-sm border-primary/20">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-sm">
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Apps Grid */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-border hover:shadow-md transition-all">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredApps.map((app) => {
              const isSelected = selectedApps.includes(app.id);
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => toggleApp(app.id)}
                  className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? "border-primary shadow-lg shadow-primary/30 bg-primary/10"
                      : "border-border hover:border-primary/50 hover:shadow-md bg-card"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        isSelected 
                          ? "bg-primary/20 shadow-lg shadow-primary/30" 
                          : "bg-primary/10 group-hover:bg-primary/20"
                      }`}>
                        <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-primary/80 group-hover:text-primary"}`} />
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 p-1 rounded-full bg-primary">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="text-left space-y-1">
                      <Badge variant="outline" className="text-xs border-primary/30 truncate w-full justify-start">
                        {app.name}
                      </Badge>
                      <Badge variant="outline" className={`text-xs truncate w-full justify-start ${categoryColors[app.category]}`}>
                        {app.category}
                      </Badge>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Count */}
        {selectedApps.length > 0 && (
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/30 animate-fade-in shadow-lg shadow-primary/20">
            <p className="text-center text-sm">
              <span className="font-semibold text-primary text-lg">{selectedApps.length}</span>
              {" "}integration{selectedApps.length !== 1 && "s"} selected
            </p>
          </div>
        )}

        {/* Navigation - Sticky on all screens */}
        <div className="sticky bottom-0 z-30 bg-background/80 backdrop-blur-lg border-t border-primary/10 -mx-6 px-6 py-3 mt-8">
          <div className="max-w-7xl mx-auto flex justify-between">
            <Button variant="outline" onClick={() => navigate("/p8/class")} className="group hover:shadow-md hover:shadow-primary/20">
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
    </div>
  );
};

export default P8Intgr8;

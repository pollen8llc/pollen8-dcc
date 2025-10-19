import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { MessageSquare, Calendar, Mail, MessageCircle, FileText, Video, CreditCard, Sparkles, CircleDot, Users, Database, ClipboardList, CalendarClock, Twitter, Linkedin, LucideIcon, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  Video: "bg-card-foreground/20 text-card-foreground border-card-foreground/50",
  Payments: "bg-card-foreground/20 text-card-foreground border-card-foreground/50",
  Knowledge: "bg-card-foreground/20 text-card-foreground border-card-foreground/50",
  Community: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  Membership: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  Database: "bg-primary/20 text-primary border-primary/50",
  Forms: "bg-card-foreground/20 text-card-foreground border-card-foreground/50",
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

const Intgr8 = () => {
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const categories = ["all", ...Array.from(new Set(allApps.map(app => app.category)))];

  const handleAppClick = (app: App) => {
    setSelectedApp(app);
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
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
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Connect Integrations</h1>
          <p className="text-sm text-muted-foreground">Link your favorite services and tools</p>
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
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app)}
                  className="group relative p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:shadow-md bg-card transition-all duration-300 hover:scale-105"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                        <Icon className="h-6 w-6 text-primary/80 group-hover:text-primary" />
                      </div>
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
      </div>

      {/* Connection Dialog */}
      <Dialog open={selectedApp !== null} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedApp && (
                <>
                  {(() => {
                    const Icon = selectedApp.icon;
                    return <Icon className="h-5 w-5 text-primary" />;
                  })()}
                  {selectedApp.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isConnecting ? (
                <div className="flex items-center gap-2 py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Connecting to {selectedApp?.name}...</span>
                </div>
              ) : (
                <div className="py-4">
                  <p className="text-sm">Integration connection process will be implemented here.</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Intgr8;

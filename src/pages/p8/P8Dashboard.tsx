import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Activity, Zap, Globe, Target, CheckCircle2 } from "lucide-react";

const P8Dashboard = () => {
  const metrics = [
    { label: "Total Members", value: "1,247", change: "+12%", icon: Users, color: "text-blue-500" },
    { label: "Engagement Rate", value: "68%", change: "+5%", icon: Activity, color: "text-green-500" },
    { label: "Active Regions", value: "8", change: "+2", icon: Globe, color: "text-purple-500" },
    { label: "Integrations", value: "6", change: "+3", icon: Zap, color: "text-orange-500" },
    { label: "Growth Rate", value: "+32%", change: "+8%", icon: TrendingUp, color: "text-cyan-500" },
    { label: "Milestones", value: "4/10", change: "+1", icon: Target, color: "text-pink-500" },
  ];

  const milestones = [
    { id: 1, title: "Define target audience", completed: true },
    { id: 2, title: "Set up core integrations", completed: true },
    { id: 3, title: "Launch first event", completed: false },
    { id: 4, title: "Reach 100 members", completed: false },
  ];

  const recentActivity = [
    { action: "New member joined", time: "2 min ago", type: "member" },
    { action: "Discord integrated", time: "1 hour ago", type: "integration" },
    { action: "Event created", time: "3 hours ago", type: "event" },
    { action: "Milestone completed", time: "1 day ago", type: "milestone" },
  ];

  const demographics = [
    { label: "Age 18-24", value: 35, color: "bg-blue-500" },
    { label: "Age 25-34", value: 45, color: "bg-green-500" },
    { label: "Age 35-44", value: 15, color: "bg-purple-500" },
    { label: "Age 45+", value: 5, color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Ecosystem Dashboard</h1>
            <p className="text-muted-foreground mt-1">Your network at a glance</p>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30">Live</Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card
                key={metric.label}
                className="p-6 bg-background/40 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                    <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary">
                      {metric.change}
                    </Badge>
                  </div>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demographics */}
          <Card className="lg:col-span-2 p-6 bg-background/40 backdrop-blur-xl border-primary/20 space-y-4">
            <h3 className="text-lg font-semibold">Demographics Breakdown</h3>
            <div className="space-y-3">
              {demographics.map((demo) => (
                <div key={demo.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{demo.label}</span>
                    <span className="font-medium">{demo.value}%</span>
                  </div>
                  <div className="h-2 bg-background/60 rounded-full overflow-hidden">
                    <div className={`h-full ${demo.color} transition-all duration-500`} style={{ width: `${demo.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Milestones */}
          <Card className="p-6 bg-background/40 backdrop-blur-xl border-primary/20 space-y-4">
            <h3 className="text-lg font-semibold">Milestones</h3>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
                    milestone.completed ? "bg-primary/10" : "bg-background/60"
                  }`}
                >
                  <CheckCircle2 className={`h-5 w-5 mt-0.5 ${milestone.completed ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm flex-1 ${milestone.completed ? "text-primary" : ""}`}>{milestone.title}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 p-6 bg-background/40 backdrop-blur-xl border-primary/20 space-y-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background/60 rounded-lg hover:bg-background/80 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm">{activity.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Network Health */}
          <Card className="p-6 bg-background/40 backdrop-blur-xl border-primary/20 space-y-4">
            <h3 className="text-lg font-semibold">Network Health</h3>
            <div className="flex items-center justify-center h-32">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-8 border-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">85%</span>
                </div>
                <div className="absolute inset-0 w-24 h-24 rounded-full border-8 border-primary border-t-transparent animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">Your ecosystem is thriving</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default P8Dashboard;

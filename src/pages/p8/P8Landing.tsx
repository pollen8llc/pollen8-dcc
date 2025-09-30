import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, TrendingUp, Network, Zap } from "lucide-react";

const P8Landing = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Active Networks", value: "2,847", icon: Network },
    { label: "Total Members", value: "156K", icon: Users },
    { label: "Growth Rate", value: "+32%", icon: TrendingUp },
    { label: "Integrations", value: "47", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-6">
        {/* Header */}
        <div className="text-center space-y-4 pt-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Ecosystem Builder
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build, grow, and optimize your network with intelligent recommendations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="p-6 bg-background/40 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary/60" />
              </div>
            </Card>
          ))}
        </div>

        {/* Main CTA */}
        <Card className="p-12 bg-background/40 backdrop-blur-xl border-primary/20 text-center space-y-6 animate-scale-in">
          <h2 className="text-3xl font-bold">Start Building Your Ecosystem</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions to get personalized recommendations for your network
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/p8/loc8")}
            className="group text-lg px-8 py-6 bg-primary hover:bg-primary/90"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>

        {/* Process Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, title: "Location", path: "/p8/loc8" },
            { step: 2, title: "Demographics", path: "/p8/asl" },
            { step: 3, title: "Network Type", path: "/p8/class" },
            { step: 4, title: "Integrations", path: "/p8/intgr8" },
          ].map((item, index) => (
            <Card
              key={item.step}
              className="p-4 bg-background/20 backdrop-blur-xl border-primary/10 hover:border-primary/30 transition-all cursor-pointer animate-fade-in"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {item.step}
                </div>
                <span className="font-medium">{item.title}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default P8Landing;

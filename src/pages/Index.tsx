
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowRight, Users, Calendar, Settings, BarChart3, ListChecks } from "lucide-react";
import { Shell } from "@/components/layout/Shell";

const Index = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && currentUser) {
      // If user is logged in, redirect to REL8 dashboard
      navigate("/rel8/dashboard");
    }
  }, [currentUser, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const features = [
    {
      icon: Users,
      title: "Contact Management",
      description: "Organize and manage your network efficiently with smart contact organization."
    },
    {
      icon: Calendar,
      title: "Relationship Tracking",
      description: "Never miss a follow-up with automated relationship reminders and scheduling."
    },
    {
      icon: ListChecks,
      title: "Smart Groups",
      description: "Segment your contacts into meaningful groups for targeted engagement."
    },
    {
      icon: BarChart3,
      title: "Insights & Analytics",
      description: "Gain valuable insights from relationship data to improve engagement."
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[#132731] z-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTIyMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10 z-0"></div>
        
        <header className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl">
                <span className="text-[#00eada]">ECO</span>8
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/documentation")}
                className="text-sm"
              >
                Documentation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/auth")}
                className="text-sm"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/auth?action=register")}
                className="text-sm"
              >
                Get Started
              </Button>
            </div>
          </div>
        </header>
        
        <section className="container mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block animate-fade-in">
              <Button 
                variant="outline" 
                className="mb-6 rounded-full text-xs tracking-wider font-semibold px-4 border-[#00eada]/30 text-[#00eada] bg-[#00eada]/5"
              >
                INTRODUCING REL8 CRM
              </Button>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in leading-tight">
              Relationship Management <br className="hidden md:inline" />
              <span className="text-[#00eada]">Reimagined</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in max-w-2xl mx-auto">
              Build stronger professional connections with our intelligent relationship management platform designed for community builders.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth?action=register")}
                className="px-8 gap-2 min-w-[180px]"
              >
                Start For Free
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/documentation")}
                className="px-8 min-w-[180px]"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
        
        {/* Background decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-0"></div>
      </div>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Manage Relationships</h2>
            <p className="text-muted-foreground">
              Our platform provides tools for every aspect of relationship management, 
              helping you keep track of your network and nurture valuable connections.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/40 bg-card/60 backdrop-blur-sm hover:border-[#00eada]/20 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-[#00eada]/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[#00eada]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats/Social Proof */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40">
              <h3 className="text-4xl font-bold text-[#00eada] mb-2">5,000+</h3>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40">
              <h3 className="text-4xl font-bold text-[#00eada] mb-2">1M+</h3>
              <p className="text-muted-foreground">Relationships Managed</p>
            </div>
            <div className="text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/40">
              <h3 className="text-4xl font-bold text-[#00eada] mb-2">98%</h3>
              <p className="text-muted-foreground">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/20 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTIyMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-10 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-border/40">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Network?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of professionals who trust REL8 to manage their most valuable connections.
                Get started for free - no credit card required.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/auth?action=register")}
                className="px-8 gap-2"
              >
                Start For Free
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/profiles/search")}
                className="px-8"
              >
                Find People
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-semibold flex items-center">
                <img 
                  src="https://www.pollen8.app/wp-content/uploads/2024/03/POLLEN8-1trans-300x52.png" 
                  alt="Pollen8 Logo" 
                  width={100} 
                  height={30} 
                  className="mr-2" 
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0 justify-center">
              <Button variant="link" onClick={() => navigate("/documentation")}>Documentation</Button>
              <Button variant="link" onClick={() => navigate("/profiles/search")}>Find People</Button>
              <Button variant="link" onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
            
            <div className="text-xs text-gray-500">
              © Powered by pollen8 labs, all rights reserved 2024.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";

// Feature data
const features = [
  {
    icon: "users",
    title: "Smart Contact Management",
    description: "Organize contacts with tags, notes, and reminders that help you remember key details and maintain authentic connections.",
    points: [
      "Intelligent tagging system", 
      "Intuitive contact organization", 
      "Custom fields and attributes"
    ]
  },
  {
    icon: "calendar",
    title: "Automated Follow-ups",
    description: "Never miss an important touchpoint with smart reminders and scheduling tools that keep your relationships active and engaged.",
    points: [
      "Customizable reminder schedules", 
      "Follow-up templates", 
      "Interaction history tracking"
    ]
  },
  {
    icon: "bar-chart-3",
    title: "Relationship Analytics",
    description: "Gain valuable insights from your network data to understand patterns, identify key connectors, and improve engagement strategies.",
    points: [
      "Network visualization", 
      "Engagement metrics", 
      "Custom reporting tools"
    ]
  }
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section with Plexus Background */}
      <section className="relative min-h-[100vh] flex items-center justify-center">
        {/* Animated Plexus Background */}
        <div className="plexus-background"></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/60 z-10"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 flex flex-col items-center justify-center py-20">
          {/* Pollen8 Logo */}
          <img 
            src="https://www.pollen8.app/wp-content/uploads/2024/03/POLLEN8-1trans.png" 
            alt="Pollen8" 
            className="max-w-full w-[600px] mb-8 animate-fade-in" 
          />
          
          {/* Tagline */}
          <h2 className="text-2xl md:text-3xl text-white text-center font-light tracking-wider animate-fade-in mb-12">
            THE FUTURE OF CONNECTIONS
          </h2>
          
          {/* CTA Button */}
          <div className="animate-fade-in">
            <Button 
              asChild
              size="lg" 
              className="px-8 gap-2 shadow-lg shadow-[#00eada]/20"
            >
              <Link to="/auth">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="currentColor" 
              className="text-background"
            ></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24 relative z-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-[#00eada]/10 text-[#00eada] text-xs tracking-wider font-semibold px-3 py-1.5 rounded-full">
              KEY FEATURES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Everything You Need To Manage Relationships</h2>
            <p className="text-muted-foreground">
              Our platform provides powerful tools for every aspect of relationship management, 
              helping you nurture connections that truly matter.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/20 bg-card/60 backdrop-blur-sm hover:border-[#00eada]/20 hover:shadow-lg transition-all duration-300 feature-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-[#00eada]/10 flex items-center justify-center mb-4">
                    {feature.icon === "users" && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#00eada]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                    {feature.icon === "calendar" && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#00eada]"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>}
                    {feature.icon === "bar-chart-3" && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#00eada]"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-center text-sm">
                        <Check className="w-4 h-4 mr-2 text-[#00eada] flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Pollen8</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Building stronger communities through meaningful relationships.
              </p>
              <div className="flex items-center">
                <img 
                  src="https://www.pollen8.app/wp-content/uploads/2024/03/POLLEN8-1trans-300x52.png" 
                  alt="Pollen8 Logo" 
                  width={100} 
                  height={30} 
                  className="mr-2" 
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/rel8/dashboard" className="text-muted-foreground hover:text-foreground text-sm">REL8</Link></li>
                <li><Link to="/communities" className="text-muted-foreground hover:text-foreground text-sm">ECO8</Link></li>
                <li><Link to="/documentation" className="text-muted-foreground hover:text-foreground text-sm">Documentation</Link></li>
                <li><Link to="/profiles/search" className="text-muted-foreground hover:text-foreground text-sm">Search Profiles</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Twitter</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">LinkedIn</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Discord</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/20">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © Powered by pollen8 labs, 2024. All rights reserved.
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button 
                asChild
                variant="outline" 
                size="sm"
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

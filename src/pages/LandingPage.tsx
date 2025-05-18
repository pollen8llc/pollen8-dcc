
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import { Features } from "@/components/landing/Features";

const PlatformModules = () => {
  return (
    <section className="py-20 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-[#00eada]/10 text-[#00eada] text-xs tracking-wider font-semibold px-3 py-1.5 rounded-full">
            PLATFORM MODULES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
            A Complete Ecosystem for Community Builders
          </h2>
          <p className="text-muted-foreground">
            Our integrated modules work together to provide a complete toolset for community organizers and dot connectors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-border/20 bg-card/60 backdrop-blur-sm hover:border-[#00eada]/20 hover:shadow-lg transition-all duration-300 feature-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#00eada]">CORE</h3>
              <p className="text-muted-foreground">
                Community organizer research and education knowledgebase powered by insights from the dot connector collective.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-border/20 bg-card/60 backdrop-blur-sm hover:border-[#00eada]/20 hover:shadow-lg transition-all duration-300 feature-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#00eada]">ECO8</h3>
              <p className="text-muted-foreground">
                A constantly growing directory of community organizers and dot connectors.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-border/20 bg-card/60 backdrop-blur-sm hover:border-[#00eada]/20 hover:shadow-lg transition-all duration-300 feature-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-[#00eada]">REL8</h3>
              <p className="text-muted-foreground">
                Relationship management module for community organizers and dot connectors.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center mt-10">
          <Button variant="ghost" className="text-[#00eada] hover:bg-[#00eada]/10 group">
            <span>Learn more</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section with Plexus Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        {/* CSS-Based Plexus Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-[#0c131a] z-0">
          {/* Dots */}
          <div className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: `radial-gradient(#00eada22 1px, transparent 1px), radial-gradient(#00eada15 1px, transparent 1px)`,
              backgroundSize: '30px 30px, 60px 60px',
              backgroundPosition: '0 0, 15px 15px'
            }}
          ></div>
          
          {/* Lines */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(to bottom right, #00eada10 1px, transparent 1px), linear-gradient(to top right, #00eada10 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>
        
        {/* Dark Overlay - more transparent */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/30 z-10"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 flex flex-col items-center justify-center py-20">
          {/* Pollen8 Logo - reduced size */}
          <img 
            src="https://www.pollen8.app/wp-content/uploads/2024/03/POLLEN8-1trans.png" 
            alt="Pollen8" 
            className="max-w-full w-[400px] mb-6 animate-fade-in" 
          />
          
          {/* Tagline - smaller text */}
          <h2 className="text-xl md:text-2xl text-white text-center font-light tracking-wider animate-fade-in mb-10">
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
      
      {/* Platform Modules Section */}
      <PlatformModules />
      
      {/* Features Section */}
      <section id="features" className="py-24 relative z-20 bg-background">
        <Features />
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

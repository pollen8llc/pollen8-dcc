
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import PlexusBackground from "@/components/community/PlexusBackground";
import ThemeToggle from "@/components/ThemeToggle";

const LandingPage: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleToggle = (value: string) => {
    setExpanded(expanded === value ? null : value);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              <span className="text-[#00eada]">DOT</span> CONNECTOR
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <Button 
              asChild 
              variant="outline" 
              className="hidden md:flex"
            >
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Column with Hero Content */}
        <div className="relative flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="relative z-10">
            <div className="mb-8">
              <p className="text-[#00eada] font-semibold tracking-wider mb-6">POLLEN8 LABS PRESENTS</p>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
                DOT CONNECTOR<br />COLLECTIVE
              </h1>
              
              <Separator className="my-8 bg-border/50" />
              
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                The Dot Connector Collective (DCC) is a living directory of community 
                organizers who power ecosystems across industries—from tech and wellness 
                to creative culture and social impact. Designed as a searchable, structured 
                hub, the DCC makes it easy to discover who's building what, where, and for 
                whom. Each profile highlights an organizer's communities, digital presence, 
                and collaboration interests. More than just a directory, the DCC serves as a 
                connective layer for cross-pollination, enabling organizers to ask questions, 
                share insights, and collectively raise the standard of community building. 
                It's where relationship-driven leaders can find their peers and plug into a 
                broader support system.
              </p>
              
              <div className="mt-12 flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/communities">Explore Directory</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth">Join The Collective</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Background effects */}
          <div className="absolute inset-0 z-0 opacity-40">
            <PlexusBackground />
          </div>
        </div>
        
        {/* Right Column with Accordion */}
        <div className="w-full md:w-[450px] bg-[#1A1F23] border-l border-border/20 p-6 md:p-8">
          <h2 className="text-[#00eada] text-xl font-semibold mb-6">COMMUNITY RESOURCES</h2>
          <Separator className="mb-6 bg-border/50" />
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="core" className="border-border/30">
              <AccordionTrigger className="text-2xl font-bold py-4">
                CORE
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Community organizer research and education knowledgebase powered by insights from the dot connector collective.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="eco8" className="border-border/30">
              <AccordionTrigger className="text-2xl font-bold py-4">
                ECO8
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                A constantly growing directory of community organizers and dot connectors.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="rel8" className="border-border/30">
              <AccordionTrigger className="text-2xl font-bold py-4">
                REL8
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Relationship management module for community organizers and dot connectors.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="gnr8" className="border-border/30">
              <AccordionTrigger className="text-2xl font-bold py-4">
                GNR8
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                A Community data report dashboard - (coming soon).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-12 flex justify-center">
            <Button asChild size="lg" className="w-full" variant="outline">
              <Link to="/auth">LOGIN</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 border-t border-border/20 bg-background">
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
            
            <div className="text-xs text-gray-500">
              © Powered by pollen8 labs, all rights reserved 2024.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;


import React from "react";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import PlexusBackground from "@/components/community/PlexusBackground";

interface CallToActionBannerProps {
  title: string;
  subtitle: string;
  onSearch: (query: string) => void;
}

const CallToActionBanner = ({
  title,
  subtitle,
  onSearch,
}: CallToActionBannerProps) => {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Plexus animated background */}
      <PlexusBackground />
      
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/70 z-10"></div>
      
      <div className="container mx-auto text-center relative z-20 px-4 py-20">
        <div className="max-w-3xl mx-auto w-full">
          <div className="mb-6 animate-fade-in">
            <Button 
              className="bg-[#00eada] text-black hover:bg-[#00eada]/90 font-bold text-sm tracking-wider"
            >
              POLLEN8 LABS PRESENTS
            </Button>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in gradient-text">
            The Future of Connections
          </h1>
          
          <p 
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" 
            style={{animationDelay: "0.1s"}}
          >
            ECO8 a directory of Resources and insights powered by community
          </p>
          
          <div className="appear-animate w-full max-w-xl mx-auto" style={{animationDelay: "0.2s"}}>
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionBanner;

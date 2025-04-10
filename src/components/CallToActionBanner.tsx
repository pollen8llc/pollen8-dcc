
import React from "react";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";

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
    <section className="relative pt-10 px-4 transition-all duration-300">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto w-full">
          <div className="mb-6 appear-animate">
            <Button 
              className="bg-aquamarine text-primary-foreground hover:bg-aquamarine/90 font-bold text-sm tracking-wider"
            >
              POLLEN8 LABS PRESENTS
            </Button>
          </div>
          <p 
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto appear-animate" 
            style={{animationDelay: "0.1s"}}
          >
            ECO8 a directory of Resources and insights powered by community
          </p>
          
          <div className="appear-animate w-full" style={{animationDelay: "0.2s"}}>
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionBanner;

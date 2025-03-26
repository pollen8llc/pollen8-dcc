
import React from "react";
import SearchBar from "@/components/SearchBar";

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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 appear-animate">
            <span className="text-aquamarine">{title}</span>
          </h1>
          <p 
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto appear-animate" 
            style={{animationDelay: "0.1s"}}
          >
            {subtitle}
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

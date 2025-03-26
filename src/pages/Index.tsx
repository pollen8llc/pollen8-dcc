
import { useState } from "react";
import { communities } from "@/data/communities";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import CommunityList from "@/components/CommunityList";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 px-4 transition-all duration-300">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto w-full">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 appear-animate">
              <span className="text-aquamarine">Dot Connector Collective</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto appear-animate" style={{animationDelay: "0.1s"}}>
              Resources and insights powered by community
            </p>
            
            <div className="appear-animate w-full" style={{animationDelay: "0.2s"}}>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Communities Section */}
      <section className="px-4 pb-20 transition-all duration-300">
        <div className="container mx-auto">
          <div>
            {searchQuery && (
              <h2 className="text-2xl font-semibold animate-fade-in">
                Search Results for "{searchQuery}"
              </h2>
            )}
            {!searchQuery && (
              <Separator className="bg-gray-300 dark:bg-gray-700 transition-all duration-300" />
            )}
          </div>
          
          <CommunityList communities={communities} searchQuery={searchQuery} />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border/20 transition-all duration-300">
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

export default Index;

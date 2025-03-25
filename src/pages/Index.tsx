
import { useState } from "react";
import { communities } from "@/data/mockData";
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
      <section className="relative pt-32 pb-16 md:pb-24 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 appear-animate">
              Find Your <span className="text-aquamarine">Community</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto appear-animate" style={{animationDelay: "0.1s"}}>
              Discover, connect, and engage with teams and departments in your organization
            </p>
            
            <div className="appear-animate" style={{animationDelay: "0.2s"}}>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Communities Section */}
      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <div className="mb-8">
            {searchQuery ? (
              <h2 className="text-2xl font-semibold">
                Search Results for "{searchQuery}"
              </h2>
            ) : (
              <Separator className="my-4 bg-gray-300 dark:bg-gray-700" />
            )}
          </div>
          
          <CommunityList communities={communities} searchQuery={searchQuery} />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-semibold flex items-center">
                <span className="bg-aquamarine rounded-lg w-8 h-8 flex items-center justify-center mr-2 shadow-sm">
                  <span className="text-primary-foreground font-bold">CD</span>
                </span>
                Community Directory
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:space-x-8 items-center">
              <div className="flex space-x-4 mb-4 md:mb-0">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Terms
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Privacy
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Contact
                </a>
              </div>
              
              <div className="text-sm text-muted-foreground">
                © 2023 Community Directory. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

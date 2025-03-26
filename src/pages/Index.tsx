
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import CommunityList from "@/components/CommunityList";
import { Separator } from "@/components/ui/separator";
import CallToActionBanner from "@/components/CallToActionBanner";
import * as communityService from "@/services/communityService";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pre-fetch communities for better UX
  useQuery({
    queryKey: ['communities'],
    queryFn: communityService.getAllCommunities
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <CallToActionBanner 
        title="Dot Connector Collective"
        subtitle="DCC a directory of Resources and insights powered by community"
        onSearch={handleSearch}
      />
      
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
          
          <CommunityList searchQuery={searchQuery} />
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


import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import CommunityList from "@/components/CommunityList";
import { Separator } from "@/components/ui/separator";
import CallToActionBanner from "@/components/CallToActionBanner";
import * as communityService from "@/services/communityService";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDebugger, setShowDebugger] = useState(true);
  
  // Pre-fetch communities for better UX with a shorter stale time to see updates sooner
  const { refetch } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      return communityService.getAllCommunities(1, 12);
    },
    staleTime: 60 * 1000, // 1 minute
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    refetch();
  };

  // Toggle debugger with Ctrl+Shift+D
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      setShowDebugger(prev => !prev);
      e.preventDefault();
    }
  };

  // Add keyboard listener
  useState(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <CallToActionBanner 
        title="ECO8 Collective"
        subtitle="ECO8 a directory of Resources and insights powered by community"
        onSearch={handleSearch}
      />
      
      {/* Communities Section */}
      <section className="px-4 pb-20 transition-all duration-300">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            {searchQuery ? (
              <h2 className="text-xl font-medium animate-fade-in">
                Search Results for "{searchQuery}"
              </h2>
            ) : (
              <h2 className="text-xl font-medium">All Communities</h2>
            )}
            
            <Button 
              onClick={handleRefresh}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator className="my-4 bg-gray-300 dark:bg-gray-700 transition-all duration-300" />
          
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

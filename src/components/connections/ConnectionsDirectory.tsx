
import React, { useEffect, useState } from "react";
import { useProfiles } from "@/hooks/useProfiles";
import { useConnections } from "@/hooks/useConnections";
import ProfileCard from "./ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ExtendedProfile } from "@/services/profileService";
import { Search, Users, UsersRound, RefreshCw } from "lucide-react";

interface ConnectionsDirectoryProps {
  maxDepth?: number;
  communityId?: string;
}

const ConnectionsDirectory: React.FC<ConnectionsDirectoryProps> = ({
  maxDepth = 3,
  communityId,
}) => {
  const { getConnectedProfiles, isLoading: profilesLoading } = useProfiles();
  const { getConnectionsByUser, isLoading: connectionsLoading } = useConnections();
  const [profiles, setProfiles] = useState<ExtendedProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ExtendedProfile[]>([]);
  const [currentDepth, setCurrentDepth] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const { toast } = useToast();

  const isLoading = profilesLoading || connectionsLoading;

  // Load connections and profiles on mount or when fetch is triggered
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        
        // Get the connections first
        const connections = await getConnectionsByUser(maxDepth);
        console.log("Loaded connections:", connections);
        
        if (connections && connections.length > 0) {
          // Now fetch the profiles
          await handleLoadProfiles();
        } else {
          // No connections, set empty profiles
          setProfiles([]);
          setFilteredProfiles([]);
        }
      } catch (err) {
        console.error("Error loading connections data:", err);
        setError("Failed to load connections. Please try again later.");
      }
    };
    
    loadData();
  }, [fetchTrigger, currentDepth, maxDepth, getConnectionsByUser]);

  // Filter profiles on search or location change
  useEffect(() => {
    filterProfiles();
  }, [search, locationFilter, profiles]);

  const handleLoadProfiles = async () => {
    try {
      setError(null);
      const loadedProfiles = await getConnectedProfiles(currentDepth, {
        communityId,
        search: "",
        location: "",
      });
      
      console.log("Loaded profiles:", loadedProfiles);
      
      if (Array.isArray(loadedProfiles)) {
        setProfiles(loadedProfiles);
        return loadedProfiles;
      } else {
        console.error("getConnectedProfiles did not return an array:", loadedProfiles);
        setProfiles([]);
        return [];
      }
    } catch (err) {
      console.error("Error loading profiles:", err);
      setError("Failed to load connection profiles.");
      setProfiles([]);
      return [];
    }
  };

  const filterProfiles = () => {
    if (!profiles || profiles.length === 0) {
      setFilteredProfiles([]);
      return;
    }
    
    let filtered = [...profiles];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(profile => {
        if (!profile) return false;
        
        const name = `${profile.first_name || ""} ${profile.last_name || ""}`.toLowerCase();
        const bio = (profile.bio || "").toLowerCase();
        const interests = profile.interests?.map(i => i.toLowerCase()) || [];
        
        return (
          name.includes(searchLower) || 
          bio.includes(searchLower) || 
          interests.some(i => i.includes(searchLower))
        );
      });
    }
    
    if (locationFilter) {
      filtered = filtered.filter(profile => 
        profile && profile.location && profile.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    setFilteredProfiles(filtered);
  };

  const handleConnect = (profileId: string) => {
    toast({
      title: "Connection requested",
      description: "Your connection request has been sent.",
    });
  };

  const refreshData = () => {
    setFetchTrigger(prev => prev + 1);
    toast({
      title: "Refreshing data",
      description: "Reloading your connections and profiles..."
    });
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={refreshData}>Try Again</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Loading connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Connections</h2>
        <Button variant="outline" size="sm" onClick={refreshData} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search people..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All locations</SelectItem>
            <SelectItem value="New York">New York</SelectItem>
            <SelectItem value="San Francisco">San Francisco</SelectItem>
            <SelectItem value="London">London</SelectItem>
            <SelectItem value="Berlin">Berlin</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        <Tabs defaultValue="1" onValueChange={(value) => setCurrentDepth(parseInt(value))}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1">1st Connections</TabsTrigger>
            <TabsTrigger value="2">2nd Connections</TabsTrigger>
            <TabsTrigger value="3">3rd Connections</TabsTrigger>
          </TabsList>
          
          {[1, 2, 3].map(depth => (
            <TabsContent key={depth} value={depth.toString()}>
              {filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProfiles.map((profile) => (
                    profile && <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No connections found</h3>
                  <p className="text-muted-foreground mt-2">
                    {search || locationFilter
                      ? "Try adjusting your filters"
                      : `You don't have any ${depth}${depth === 1 ? "st" : depth === 2 ? "nd" : "rd"} degree connections yet.`}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ConnectionsDirectory;

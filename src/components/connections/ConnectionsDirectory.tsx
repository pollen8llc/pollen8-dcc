
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
import { ConnectionData } from "@/services/connectionService";
import { Search, Users, UsersRound } from "lucide-react";

interface ConnectionsDirectoryProps {
  maxDepth?: number;
  communityId?: string;
}

const ConnectionsDirectory: React.FC<ConnectionsDirectoryProps> = ({
  maxDepth = 3,
  communityId,
}) => {
  const { getConnectedProfiles, isLoading: profilesLoading } = useProfiles();
  const { connections, getConnectionsByUser, getConnectionDepth, isLoading: connectionsLoading } = useConnections();
  const [profiles, setProfiles] = useState<ExtendedProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ExtendedProfile[]>([]);
  const [currentDepth, setCurrentDepth] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const { toast } = useToast();

  const isLoading = profilesLoading || connectionsLoading;

  // Load connections and profiles on mount
  useEffect(() => {
    const loadData = async () => {
      await getConnectionsByUser(maxDepth);
      await handleLoadProfiles();
    };
    
    loadData();
  }, [getConnectionsByUser, maxDepth]);

  // Handle depth changes
  useEffect(() => {
    handleLoadProfiles();
  }, [currentDepth]);

  // Filter profiles on search or location change
  useEffect(() => {
    filterProfiles();
  }, [search, locationFilter, profiles]);

  const handleLoadProfiles = async () => {
    const loadedProfiles = await getConnectedProfiles(currentDepth, {
      communityId,
      search: "",
      location: "",
    });
    
    setProfiles(loadedProfiles);
    return loadedProfiles;
  };

  const filterProfiles = () => {
    let filtered = [...profiles];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(profile => {
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
        profile.location && profile.location.toLowerCase().includes(locationFilter.toLowerCase())
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

  const isConnectedWith = (profileId: string) => {
    return connections.some(conn => 
      (conn.inviter_id === profileId || conn.invitee_id === profileId) && 
      conn.connection_depth === 1
    );
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Connections</h2>

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
            {/* We would dynamically populate this from available locations */}
            <SelectItem value="New York">New York</SelectItem>
            <SelectItem value="San Francisco">San Francisco</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="1" value={currentDepth.toString()} onValueChange={(v) => setCurrentDepth(parseInt(v, 10))}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="1" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>1st Connections</span>
          </TabsTrigger>
          <TabsTrigger value="2" className="flex items-center gap-1">
            <UsersRound className="h-4 w-4" />
            <span>2nd Connections</span>
          </TabsTrigger>
          <TabsTrigger value="3" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>3rd Connections</span>
          </TabsTrigger>
        </TabsList>

        {[1, 2, 3].map((depth) => (
          <TabsContent key={depth} value={depth.toString()}>
            {filteredProfiles.length === 0 ? (
              <div className="text-center p-8 border rounded-lg">
                <p className="text-muted-foreground">No connections found at this level</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    connectionDepth={depth}
                    onConnect={depth > 1 ? () => handleConnect(profile.id) : undefined}
                    isConnected={depth === 1 || isConnectedWith(profile.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ConnectionsDirectory;

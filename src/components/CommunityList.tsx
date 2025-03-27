
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CommunityCard from "./CommunityCard";
import { Community } from "@/models/types";
import * as communityService from "@/services/communityService";

interface CommunityListProps {
  searchQuery: string;
}

const CommunityList = ({ searchQuery }: CommunityListProps) => {
  const { data: communities = [], isLoading, error } = useQuery({
    queryKey: ['communities'],
    queryFn: communityService.getAllCommunities
  });

  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);

  useEffect(() => {
    // Set filtered communities to all communities initially
    if (!searchQuery.trim()) {
      setFilteredCommunities(communities);
      return;
    }

    const filterCommunities = async () => {
      try {
        const filtered = await communityService.searchCommunities(searchQuery);
        setFilteredCommunities(filtered);
      } catch (err) {
        console.error("Error searching communities:", err);
        // Fallback to client-side filtering if API search fails
        const lowercaseQuery = searchQuery.toLowerCase();
        const filtered = communities.filter(community => 
          community.name.toLowerCase().includes(lowercaseQuery) ||
          (community.description?.toLowerCase().includes(lowercaseQuery) || false) ||
          community.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
        setFilteredCommunities(filtered);
      }
    };

    filterCommunities();
  }, [communities, searchQuery]);

  if (isLoading) {
    return (
      <div className="w-full py-12 text-center">
        <h3 className="text-lg font-medium">Loading communities...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center">
        <h3 className="text-lg font-medium text-red-500">Error loading communities</h3>
        <p className="mt-2 text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  if (filteredCommunities.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <h3 className="text-lg font-medium">No communities found</h3>
        <p className="mt-2 text-muted-foreground">
          Try a different search term or check back later for new communities.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full pt-4">
      {filteredCommunities.map((community) => (
        <div key={community.id} className="appear-animate w-full" style={{animationDelay: `${parseInt(community.id) * 0.1}s`}}>
          <CommunityCard community={community} />
        </div>
      ))}
    </div>
  );
};

export default CommunityList;

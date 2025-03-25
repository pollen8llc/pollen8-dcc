
import { useState, useEffect } from "react";
import CommunityCard from "./CommunityCard";
import { Community } from "@/data/types";

interface CommunityListProps {
  communities: Community[];
  searchQuery: string;
}

const CommunityList = ({ communities, searchQuery }: CommunityListProps) => {
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(communities);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCommunities(communities);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = communities.filter(
      (community) =>
        community.name.toLowerCase().includes(query) ||
        community.description.toLowerCase().includes(query) ||
        community.location.toLowerCase().includes(query) ||
        community.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    setFilteredCommunities(filtered);
  }, [communities, searchQuery]);

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCommunities.map((community) => (
        <div key={community.id} className="appear-animate" style={{animationDelay: `${parseInt(community.id) * 0.1}s`}}>
          <CommunityCard community={community} />
        </div>
      ))}
    </div>
  );
};

export default CommunityList;

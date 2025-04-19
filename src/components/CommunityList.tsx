
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import CommunityCard from "./CommunityCard";
import { Community } from "@/models/types";
import * as communityService from "@/services/communityService";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

interface CommunityListProps {
  searchQuery: string;
}

const CommunityList = ({ searchQuery }: CommunityListProps) => {
  const [page, setPage] = useState(1);
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 12;
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });
  
  // Fetch communities with pagination
  const {
    data: communities = [],
    isLoading: isLoadingCommunities,
    isFetching: isFetchingCommunities,
    error: communitiesError
  } = useQuery({
    queryKey: ['communities', page, pageSize, searchQuery],
    queryFn: async () => {
      console.log(`Fetching page ${page} with query "${searchQuery}"`);
      
      if (searchQuery) {
        return communityService.searchCommunities(searchQuery);
      } else {
        return communityService.getAllCommunities(page, pageSize);
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Update the combined list when new data arrives
  useEffect(() => {
    if (communities.length > 0) {
      if (page === 1) {
        setAllCommunities(communities);
      } else {
        setAllCommunities(prev => [...prev, ...communities]);
      }
      setHasMore(communities.length === pageSize);
    } else if (page === 1) {
      setAllCommunities([]);
      setHasMore(false);
    } else {
      setHasMore(false);
    }
  }, [communities, page]);
  
  // Reset pagination when search query changes
  useEffect(() => {
    console.log("Search query changed to:", searchQuery);
    setPage(1);
    setAllCommunities([]);
    setHasMore(true);
  }, [searchQuery]);
  
  // Load more when the load more element comes into view
  useEffect(() => {
    if (inView && hasMore && !isFetchingCommunities) {
      console.log("Loading more communities");
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, hasMore, isFetchingCommunities]);
  
  // Handle manual load more
  const handleLoadMore = useCallback(() => {
    if (!isFetchingCommunities && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [isFetchingCommunities, hasMore]);
  
  if (isLoadingCommunities && page === 1) {
    return (
      <div className="w-full py-12 text-center">
        <div className="flex justify-center items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <h3 className="text-lg font-medium">Loading communities...</h3>
        </div>
      </div>
    );
  }

  if (communitiesError) {
    return (
      <div className="w-full py-12 text-center">
        <h3 className="text-lg font-medium text-red-500">Error loading communities</h3>
        <p className="mt-2 text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  if (allCommunities.length === 0 && !isLoadingCommunities) {
    return (
      <div className="w-full py-12 text-center">
        <h3 className="text-lg font-medium">No communities found</h3>
        <p className="mt-2 text-muted-foreground">
          {searchQuery 
            ? `No results found for "${searchQuery}". Try a different search term.` 
            : 'No communities available at the moment.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
        {allCommunities.map((community, index) => (
          <div 
            key={community.id} 
            className="appear-animate w-full" 
            style={{animationDelay: `${Math.min(index * 0.05, 0.5)}s`}}
          >
            <CommunityCard community={community} />
          </div>
        ))}
      </div>
      
      {/* Load more indicator */}
      {hasMore && (
        <div 
          ref={loadMoreRef}
          className="w-full py-8 flex justify-center"
        >
          {isFetchingCommunities && page > 1 ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading more...</span>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isFetchingCommunities}
            >
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityList;

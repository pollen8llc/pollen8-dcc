
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityMetaInfo from "@/components/community/CommunityMetaInfo";
import CommunityTabs from "@/components/community/CommunityTabs";
import NotFoundState from "@/components/community/NotFoundState";
import * as communityService from "@/services/communityService";
import * as userService from "@/services/userService";

const CommunityProfile = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: community, isLoading: communityLoading, error: communityError } = useQuery({
    queryKey: ['community', id],
    queryFn: () => communityService.getCommunityById(id || ""),
    enabled: !!id
  });
  
  const { data: organizers = [], isLoading: organizersLoading } = useQuery({
    queryKey: ['organizers', id],
    queryFn: () => userService.getCommunityOrganizers(id || ""),
    enabled: !!id
  });
  
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['members', id],
    queryFn: () => userService.getCommunityMembers(id || ""),
    enabled: !!id
  });
  
  if (communityLoading || organizersLoading || membersLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Loading community information...</h1>
        </div>
      </div>
    );
  }
  
  if (communityError || !community) {
    return <NotFoundState />;
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <CommunityHeader community={community} />
      <CommunityMetaInfo communityId={community.id} />
      <CommunityTabs 
        communityId={community.id}
        organizers={organizers}
        members={members}
        memberCount={community.communitySize}
      />
    </div>
  );
};

export default CommunityProfile;

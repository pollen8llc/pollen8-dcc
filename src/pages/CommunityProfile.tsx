
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityMetaInfo from "@/components/community/CommunityMetaInfo";
import CommunityTabs from "@/components/community/CommunityTabs";
import NotFoundState from "@/components/community/NotFoundState";
import { getCommunityById, getCommunityOrganizers, getCommunityRegularMembers } from "@/data/dataUtils";

const CommunityProfile = () => {
  const { id } = useParams<{ id: string }>();
  const community = getCommunityById(id || "");
  const organizers = getCommunityOrganizers(id || "");
  const members = getCommunityRegularMembers(id || "");
  
  if (!community) {
    return <NotFoundState />;
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <CommunityHeader community={community} />
      <CommunityMetaInfo />
      <CommunityTabs 
        communityId={community.id}
        organizers={organizers}
        members={members}
        memberCount={community.memberCount}
      />
    </div>
  );
};

export default CommunityProfile;

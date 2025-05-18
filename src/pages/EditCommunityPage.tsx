
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/models/types";
import { Shell } from "@/components/layout/Shell";
import { CommunityForm } from "@/components/community/CommunityForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getCommunityById, CommunityError } from "@/services/communityService";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function EditCommunityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in and has proper role
  const isOrganizer = currentUser?.role === UserRole.ORGANIZER || currentUser?.role === UserRole.ADMIN;

  useEffect(() => {
    const loadCommunity = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getCommunityById(id);
        setCommunity(data);

        // Check if current user is the owner of this community or an admin
        if (
          !currentUser ||
          (currentUser.id !== data.owner_id && currentUser.role !== UserRole.ADMIN)
        ) {
          setError("You don't have permission to edit this community.");
        }
      } catch (err) {
        console.error("Failed to load community:", err);
        setError(
          err instanceof CommunityError
            ? err.message
            : "Failed to load community. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
  }, [id, currentUser]);

  // If user is not an organizer, show permission message
  if (!isOrganizer) {
    return (
      <Shell>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Permission Required</AlertTitle>
          <AlertDescription>
            You need organizer permissions to edit communities. Please contact an administrator.
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </Shell>
    );
  }

  return (
    <Shell>
      <Button 
        variant="ghost" 
        className="flex items-center mb-6"
        onClick={() => navigate(`/community/${id}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community
      </Button>
      
      {loading ? (
        <div className="space-y-6">
          <div>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-full mt-2" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : community ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Community: {community.name}</h1>
            <p className="text-muted-foreground mt-2">
              Update your community details below. All fields marked with an asterisk (*) are required.
            </p>
          </div>
          
          <CommunityForm 
            mode="edit" 
            communityId={id} 
            defaultValues={{
              name: community.name,
              description: community.description,
              type: community.type || "tech",
              format: community.format || "hybrid",
              location: community.location || "Remote",
              target_audience: community.target_audience || [],
              website: community.website || "",
              newsletter_url: community.newsletter_url || "",
              social_media: community.social_media || {
                twitter: "",
                instagram: "",
                linkedin: "",
                facebook: ""
              },
              is_public: community.is_public,
              founder_name: community.founder_name,
              role_title: community.role_title,
              vision: community.vision,
              community_values: community.community_values,
              community_structure: community.community_structure,
              community_size: community.member_count
            }} 
          />
        </div>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Community Not Found</AlertTitle>
          <AlertDescription>
            The community you're looking for doesn't exist or you don't have permission to view it.
          </AlertDescription>
        </Alert>
      )}
    </Shell>
  );
}

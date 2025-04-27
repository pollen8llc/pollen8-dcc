
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Community } from "@/models/types";

interface ManagedCommunitiesGridProps {
  communities: Community[];
}

const ManagedCommunitiesGrid = ({ communities }: ManagedCommunitiesGridProps) => {
  const navigate = useNavigate();

  // If no communities, return null to not render anything
  if (!communities || communities.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community: Community) => (
          <Card 
            key={community.id}
            className="hover:shadow-md cursor-pointer transition-all"
            onClick={() => navigate(`/admin/community/${community.id}`)}
          >
            <CardHeader className="pb-2">
              <CardTitle>{community.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative mb-4 overflow-hidden rounded-md">
                <img 
                  src={community.logo_url || '/placeholder.svg'} 
                  alt={community.name} 
                  className="object-cover w-full h-full" 
                />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {community.description}
              </p>
              <div className="mt-4 text-sm">
                <span className="font-medium">{community.communitySize}</span> members
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManagedCommunitiesGrid;

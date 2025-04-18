
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Community } from "@/models/types";

interface CommunitiesListProps {
  isLoading: boolean;
  managedCommunities: Community[] | undefined;
  onDeleteCommunity: (id: string) => void;
}

const CommunitiesList = ({ isLoading, managedCommunities, onDeleteCommunity }: CommunitiesListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!managedCommunities?.length) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-muted-foreground mb-4">You haven't created any communities yet</p>
        <Button 
          onClick={() => navigate("/create-community")}
          variant="outline"
        >
          Create Your First Community
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {managedCommunities.map((community) => (
        <Card 
          key={community.id}
          className="hover:shadow-md transition-all"
        >
          <CardHeader>
            <CardTitle>{community.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative mb-4 overflow-hidden rounded-md">
              <img 
                src={community.imageUrl} 
                alt={community.name} 
                className="object-cover w-full h-full" 
              />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {community.description}
            </p>
            <div className="mt-4 text-sm">
              <span className="font-medium">{community.memberCount}</span> members
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate(`/community/${community.id}`)}
              >
                View
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate(`/admin/community/${community.id}`)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDeleteCommunity(community.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommunitiesList;

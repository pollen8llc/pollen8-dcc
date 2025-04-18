
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Globe, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Community } from "@/models/types";

interface DirectoryTabProps {
  isLoading: boolean;
  managedCommunities: Community[] | undefined;
  onToggleVisibility: (community: Community) => void;
}

const DirectoryTab = ({ isLoading, managedCommunities, onToggleVisibility }: DirectoryTabProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Directory Visibility</CardTitle>
        <CardDescription>
          Control which of your communities appear in the public directory
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        ) : managedCommunities?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven't created any communities yet</p>
            <Button 
              onClick={() => navigate("/create-community")}
              variant="outline"
            >
              Create Your First Community
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {managedCommunities?.map((community) => (
              <Card key={community.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={community.imageUrl} 
                        alt={community.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{community.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {community.memberCount} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {community.isPublic ? (
                      <Globe className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-red-500" />
                    )}
                    <Switch 
                      checked={community.isPublic} 
                      onCheckedChange={() => onToggleVisibility(community)}
                      aria-label="Toggle directory visibility"
                    />
                    <span className="text-sm ml-1">
                      {community.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DirectoryTab;

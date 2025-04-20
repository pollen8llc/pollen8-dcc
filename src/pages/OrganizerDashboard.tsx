
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityMetaInfo from "@/components/community/CommunityMetaInfo";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import * as communityService from "@/services/communityService";
import NotFoundState from "@/components/community/NotFoundState";
import { useState, useEffect } from "react";

const OrganizerDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: community, isLoading, error } = useQuery({
    queryKey: ["community", id],
    queryFn: () => communityService.getCommunityById(id || ""),
    enabled: !!id,
  });

  // Editing state for name, description, isPublic
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedIsPublic, setEditedIsPublic] = useState(true);

  useEffect(() => {
    if (community) {
      setEditedName(community.name);
      setEditedDescription(community.description);
      setEditedIsPublic(community.isPublic);
    }
  }, [community]);

  const mutation = useMutation({
    mutationFn: async (updatedFields: { name: string; description: string; isPublic: boolean }) => {
      if (!community) throw new Error("No community loaded");
      return await communityService.updateCommunity({
        ...community,
        name: updatedFields.name,
        description: updatedFields.description,
        isPublic: updatedFields.isPublic,
      });
    },
    onSuccess() {
      toast({
        title: "Community updated",
        description: "Community details have been updated successfully.",
      });
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: ["community", id] });
    },
    onError(error: any) {
      toast({
        title: "Update failed",
        description: error?.message || "Could not update the community.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Loading community...</h1>
        </div>
      </div>
    );
  }
  if (error || !community) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <CommunityHeader community={community} />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <Card className="glass dark:glass-dark mb-8">
              <CardContent className="p-7">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Overview & Edit</h2>
                  {!editMode ? (
                    <Button variant="outline" onClick={() => setEditMode(true)}>
                      Edit
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setEditMode(false);
                        setEditedName(community.name);
                        setEditedDescription(community.description);
                        setEditedIsPublic(community.isPublic);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                {/* Editing form */}
                {!editMode ? (
                  <div className="space-y-4">
                    <div>
                      <span className="block text-muted-foreground text-sm mb-1">Community name</span>
                      <span className="text-lg font-bold">{community.name}</span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-sm mb-1">Description</span>
                      <span className="">{community.description}</span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground text-sm mb-1">Visibility</span>
                      <span className="font-medium">{community.isPublic ? "Public" : "Private"}</span>
                    </div>
                  </div>
                ) : (
                  <form
                    className="space-y-4"
                    onSubmit={e => {
                      e.preventDefault();
                      mutation.mutate({
                        name: editedName,
                        description: editedDescription,
                        isPublic: editedIsPublic,
                      });
                    }}
                  >
                    <div>
                      <label className="block text-muted-foreground text-sm mb-1" htmlFor="name">
                        Community name
                      </label>
                      <Input
                        id="name"
                        value={editedName}
                        onChange={e => setEditedName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground text-sm mb-1" htmlFor="desc">
                        Description
                      </label>
                      <Textarea
                        id="desc"
                        value={editedDescription}
                        onChange={e => setEditedDescription(e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-muted-foreground" htmlFor="isPublic">Public</label>
                      <Switch
                        id="isPublic"
                        checked={editedIsPublic}
                        onCheckedChange={setEditedIsPublic}
                      />
                    </div>
                    <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
                      {mutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card className="glass dark:glass-dark">
              <CardContent className="p-7">
                <h2 className="text-xl font-semibold mb-3">Meta Information</h2>
                <CommunityMetaInfo communityId={community.id} />
              </CardContent>
            </Card>
          </div>
          {/* Right panel for stats or additional features */}
          <div className="flex-1 min-w-0">
            <Card className="glass dark:glass-dark">
              <CardContent className="p-7 flex flex-col gap-4">
                <h2 className="font-semibold text-lg mb-3">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Members</div>
                    <div className="text-2xl font-bold">{community.communitySize}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Format</div>
                    <div className="text-base">{community.format}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Type</div>
                    <div className="text-base">{community.communityType}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Location</div>
                    <div className="text-base">{community.location}</div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div>
                  <div className="text-muted-foreground text-xs mb-1">Last updated</div>
                  <div>{community.updatedAt ? new Date(community.updatedAt).toLocaleString() : "N/A"}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;


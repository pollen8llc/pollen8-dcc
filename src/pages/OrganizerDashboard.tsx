import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/models/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shell } from "@/components/layout/Shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus } from "lucide-react";
import * as communityService from "@/services/community/communityMutationService";

export default function OrganizerDashboard() {
  const { currentUser } = useUser();
  const [communities, setCommunities] = useState<Community[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      try {
        if (!currentUser?.id) {
          console.warn("User ID not available. Cannot fetch communities.");
          return;
        }

        const { data, error } = await supabase
          .from("communities")
          .select("*")
          .eq("owner_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching communities:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load communities.",
          });
          return;
        }

        setCommunities(data);
      } catch (error: any) {
        console.error("Unexpected error fetching communities:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load communities.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, [currentUser?.id, toast]);

  const deleteCommunity = async (communityId: string, options: any) => {
    try {
      if (!communityId) {
        throw new Error("Community ID is required to delete.");
      }

      // Optimistically update the UI
      setCommunities((prevCommunities) =>
        prevCommunities?.filter((community) => community.id !== communityId) || []
      );

      // Call the deleteCommunity function from communityService
      await communityService.deleteCommunity(communityId);

      toast({
        title: "Success",
        description: "Community deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting community:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete community.",
      });

      // Revert the UI update in case of an error
      setCommunities((prevCommunities) => {
        if (prevCommunities) {
          return [...prevCommunities];
        }
        return null;
      });
    }
  };

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Communities</h1>
          <p className="text-muted-foreground">
            Manage and moderate the communities you organize.
          </p>
        </div>
        <Button asChild>
          <Link to="/create-community">
            <Plus className="mr-2 h-4 w-4" />
            Create Community
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-5 w-4/5" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton className="h-4 w-3/5" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </AvatarFallback>
                  </Avatar>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : communities && communities.length > 0 ? (
          <ScrollArea>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {communities.map((community) => (
                <Card key={community.id}>
                  <CardHeader>
                    <CardTitle>{community.name}</CardTitle>
                    <CardDescription>{community.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Location: {community.location}</p>
                    <p>Type: {community.type}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Avatar>
                      <AvatarImage src={currentUser?.imageUrl} alt={currentUser?.name} />
                      <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link to={`/community/${community.id}/edit`}>
                            Edit Community
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteCommunity(community.id, {})}
                          className="text-destructive focus:bg-destructive/5"
                        >
                          Delete Community
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">No Communities Yet</h2>
            <p className="text-muted-foreground mt-2">
              Get started by creating your first community.
            </p>
            <Button asChild className="mt-4">
              <Link to="/create-community">Create Community</Link>
            </Button>
          </div>
        )}
      </div>
    </Shell>
  );
}

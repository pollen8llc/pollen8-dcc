
import React from "react";
import { User } from "@/models/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Community {
  id: string;
  name: string;
  logo_url?: string;
  role: string;
}

interface UserCommunitiesDialogProps {
  user: User | null;
  communities: Community[];
  isLoading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserCommunitiesDialog({
  user,
  communities,
  isLoading,
  open,
  onOpenChange,
}: UserCommunitiesDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Communities for {user.name}</DialogTitle>
          <DialogDescription>
            {communities.length === 0
              ? "This user is not a member of any communities."
              : `Member of ${communities.length} communities.`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No communities found for this user.
          </div>
        ) : (
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {communities.map((community) => (
                <div
                  key={community.id}
                  className="flex items-center space-x-4 p-4 border rounded-md"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={community.logo_url} alt={community.name} />
                    <AvatarFallback>
                      {community.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{community.name}</p>
                    <Badge
                      variant={community.role === "admin" ? "default" : "outline"}
                      className="mt-1"
                    >
                      {community.role === "admin" ? "Organizer" : "Member"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

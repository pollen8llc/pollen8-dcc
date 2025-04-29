
import React, { useEffect, useState } from "react";
import { useInvites } from "@/hooks/useInvites";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { format, formatDistanceToNow } from "date-fns";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InviteData } from "@/services/inviteService";
import { Badge } from "@/components/ui/badge";

const InviteListItem: React.FC<{
  invite: InviteData;
  onInvalidate: (id: string) => Promise<void>;
}> = ({ invite, onInvalidate }) => {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const inviteLink = `${baseUrl}/invite/${invite.link_id}`;

  const copyToClipboard = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${
        type === "code" ? "Invite code" : "Invite link"
      } copied to clipboard`,
    });
  };

  const isExpired = invite.expires_at && new Date(invite.expires_at) < new Date();
  const isMaxedOut = invite.max_uses !== null && invite.used_count >= invite.max_uses;
  const isInactive = !invite.is_active || isExpired || isMaxedOut;

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "PPP");
    } catch (e) {
      return date;
    }
  };

  const getStatusBadge = () => {
    if (!invite.is_active) {
      return <Badge variant="destructive">Invalidated</Badge>;
    }
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (isMaxedOut) {
      return <Badge variant="destructive">Maxed Out</Badge>;
    }
    return <Badge variant="success">Active</Badge>;
  };

  return (
    <Card className={isInactive ? "opacity-60" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Invite {invite.code}</CardTitle>
            <CardDescription>
              Created {formatDistanceToNow(new Date(invite.created_at), { addSuffix: true })}
            </CardDescription>
          </div>
          <div>{getStatusBadge()}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Uses</p>
              <p>
                {invite.used_count} / {invite.max_uses === null ? "∞" : invite.max_uses}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Expires</p>
              <p>
                {invite.expires_at
                  ? formatDate(invite.expires_at)
                  : "Never"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Code</span>
              <div className="flex items-center">
                <span className="text-sm font-mono mr-2">{invite.code}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(invite.code, "code")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Link</span>
              <div className="flex items-center">
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 text-xs"
                  onClick={() => window.open(inviteLink, "_blank")}
                >
                  View <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(inviteLink, "link")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {invite.community_id && (
            <Badge variant="outline">Community Specific</Badge>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isInactive}>
              <Trash2 className="h-4 w-4 mr-1" /> Invalidate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invalidate Invite</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The invite will no longer work.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => onInvalidate(invite.id!)}
              >
                Invalidate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

interface InviteListProps {
  communityId?: string;
}

const InviteList: React.FC<InviteListProps> = ({ communityId }) => {
  const { invites, getInvitesByCreator, invalidateInvite, isLoading } = useInvites();
  const { toast } = useToast();
  const [filteredInvites, setFilteredInvites] = useState<InviteData[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    const loadInvites = async () => {
      await getInvitesByCreator();
    };

    loadInvites();
  }, [getInvitesByCreator]);

  useEffect(() => {
    // Filter invites by community ID if provided
    let filtered = [...invites];
    
    if (communityId) {
      filtered = filtered.filter(invite => invite.community_id === communityId);
    }
    
    // Apply active/inactive filter
    if (filter === "active") {
      filtered = filtered.filter(invite => {
        const isExpired = invite.expires_at && new Date(invite.expires_at) < new Date();
        const isMaxedOut = invite.max_uses !== null && invite.used_count >= invite.max_uses;
        return invite.is_active && !isExpired && !isMaxedOut;
      });
    } else if (filter === "inactive") {
      filtered = filtered.filter(invite => {
        const isExpired = invite.expires_at && new Date(invite.expires_at) < new Date();
        const isMaxedOut = invite.max_uses !== null && invite.used_count >= invite.max_uses;
        return !invite.is_active || isExpired || isMaxedOut;
      });
    }
    
    setFilteredInvites(filtered);
  }, [invites, communityId, filter]);

  const handleInvalidate = async (id: string) => {
    const success = await invalidateInvite(id);
    if (success) {
      toast({
        title: "Success",
        description: "Invite has been invalidated",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Invites</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm" 
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={filter === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("inactive")}
          >
            Inactive
          </Button>
        </div>
      </div>

      {filteredInvites.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">No invites found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInvites.map((invite) => (
            <InviteListItem
              key={invite.id}
              invite={invite}
              onInvalidate={handleInvalidate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InviteList;

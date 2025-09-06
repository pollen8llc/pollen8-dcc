import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/models/types";
import { useInvites } from "@/hooks/useInvites";
import { useToast } from "@/hooks/use-toast";
import InviteGenerator from "@/components/invites/InviteGenerator";
import Navbar from "@/components/Navbar";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { 
  Users, 
  Copy, 
  Share, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Calendar,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

const InvitesDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { invites, getInvitesByCreator, invalidateInvite, isLoading } = useInvites();
  const [refreshing, setRefreshing] = useState(false);
  const [invalidatingIds, setInvalidatingIds] = useState<Set<string>>(new Set());

  // Only allow ORGANIZER or ADMIN
  if (!currentUser || ![UserRole.ORGANIZER, UserRole.ADMIN].includes(currentUser.role)) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    try {
      setRefreshing(true);
      await getInvitesByCreator();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load invites",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`
    });
  };

  const handleInvalidate = async (inviteId: string) => {
    setInvalidatingIds(prev => new Set(prev).add(inviteId));
    try {
      await invalidateInvite(inviteId);
      toast({
        title: "Success",
        description: "Invite invalidated successfully"
      });
      await loadInvites();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to invalidate invite",
        variant: "destructive"
      });
    } finally {
      setInvalidatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(inviteId);
        return newSet;
      });
    }
  };

  const getInviteStatus = (invite: any) => {
    if (!invite.is_active) return { text: "Inactive", color: "bg-gray-500" };
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return { text: "Expired", color: "bg-red-500" };
    }
    if (invite.max_uses && invite.used_count >= invite.max_uses) {
      return { text: "Full", color: "bg-orange-500" };
    }
    return { text: "Active", color: "bg-green-500" };
  };

  const activeInvites = invites.filter(invite => 
    invite.is_active && 
    (!invite.expires_at || new Date(invite.expires_at) > new Date()) &&
    (!invite.max_uses || invite.used_count < invite.max_uses)
  );

  const totalUses = invites.reduce((sum, invite) => sum + invite.used_count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />

      {/* Mobile-First Layout */}
      <div className="w-full px-4 py-6 pb-20">
        <div className="container mx-auto max-w-4xl space-y-6">
          
          {/* Header with Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Invite Management</h1>
              <p className="text-muted-foreground text-sm">
                Create and manage your invitation codes
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={loadInvites}
                disabled={refreshing}
                className="flex-1 sm:flex-none"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <InviteGenerator onInviteCreated={loadInvites} />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Invites</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{invites.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Active Invites</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{activeInvites.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Uses</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalUses}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invites List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your Invites</h2>
            
            {isLoading && !refreshing ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : invites.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No invites yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first invite to get started
                  </p>
                  <InviteGenerator onInviteCreated={loadInvites} />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {invites.map((invite) => {
                  const status = getInviteStatus(invite);
                  const inviteUrl = `${window.location.origin}/invite/${invite.link_id}`;
                  
                  return (
                    <Card 
                      key={invite.id} 
                      className="hover:shadow-md transition-shadow duration-200"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <CardTitle className="text-base font-mono">
                                {invite.code}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${status.color}`} />
                                <Badge variant="outline" className="text-xs">
                                  {status.text}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(invite.code, "Invite code")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(inviteUrl, "Invite link")}
                            >
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Created</p>
                              <p className="font-medium">
                                {format(new Date(invite.created_at), 'MMM dd')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Usage</p>
                              <p className="font-medium">
                                {invite.used_count} / {invite.max_uses || '∞'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {invite.expires_at && (
                          <div className="mt-3 flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Expires:</span>
                            <span className="font-medium">
                              {format(new Date(invite.expires_at), 'PPP')}
                            </span>
                          </div>
                        )}

                        {invite.is_active && (
                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleInvalidate(invite.id!)}
                              disabled={invalidatingIds.has(invite.id!)}
                              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            >
                              {invalidatingIds.has(invite.id!) ? (
                                <>
                                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                  Invalidating...
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Invalidate
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitesDashboard;
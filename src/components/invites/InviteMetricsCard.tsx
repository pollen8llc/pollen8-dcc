import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Share, 
  BarChart3, 
  Clock, 
  Calendar,
  Eye,
  MousePointer,
  Users,
  TrendingUp,
  XCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { InviteData } from '@/services/inviteService';
import { useToast } from '@/hooks/use-toast';

interface InviteMetricsCardProps {
  invite: InviteData;
  onInvalidate: (inviteId: string) => void;
  isInvalidating: boolean;
}

export const InviteMetricsCard: React.FC<InviteMetricsCardProps> = ({
  invite,
  onInvalidate,
  isInvalidating
}) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`
    });
  };

  const getInviteStatus = () => {
    if (!invite.is_active) return { text: "Inactive", color: "bg-destructive", icon: XCircle };
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return { text: "Expired", color: "bg-destructive", icon: AlertCircle };
    }
    if (invite.max_uses && invite.used_count >= invite.max_uses) {
      return { text: "Exhausted", color: "bg-secondary", icon: AlertCircle };
    }
    return { text: "Active", color: "bg-primary", icon: CheckCircle };
  };

  const status = getInviteStatus();
  const inviteUrl = `${window.location.origin}/invite/${invite.link_id}`;
  const clickRate = 0; // Placeholder for future analytics
  const conversionRate = invite.used_count > 0 ? (invite.used_count / Math.max(clickRate, 1)) * 100 : 0;

  return (
    <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-mono text-primary">
                {invite.code}
              </CardTitle>
              <Badge 
                variant="secondary" 
                className={`${status.color} text-primary-foreground border-0 shadow-md`}
              >
                <status.icon className="h-3 w-3 mr-1" />
                {status.text}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(new Date(invite.created_at), { addSuffix: true })}
            </p>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(invite.code, "Invite code")}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(inviteUrl, "Invite link")}
              className="h-8 w-8 p-0"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Primary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs uppercase font-medium">Uses</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {invite.used_count}
              <span className="text-sm text-muted-foreground">
                /{invite.max_uses || '∞'}
              </span>
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-xs uppercase font-medium">Views</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {clickRate}
              <span className="text-sm text-muted-foreground opacity-50"> soon</span>
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MousePointer className="h-4 w-4" />
              <span className="text-xs uppercase font-medium">Rate</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {conversionRate.toFixed(0)}%
              <span className="text-sm text-muted-foreground opacity-50"> soon</span>
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs uppercase font-medium">Growth</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              +0
              <span className="text-sm text-muted-foreground opacity-50"> soon</span>
            </p>
          </div>
        </div>

        {/* Usage Progress */}
        {invite.max_uses && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Usage Progress</span>
              <span className="text-foreground font-medium">
                {Math.round((invite.used_count / invite.max_uses) * 100)}%
              </span>
            </div>
            <div className="w-full bg-secondary/20 rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min((invite.used_count / invite.max_uses) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Expiration Info */}
        {invite.expires_at && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Expires:</span>
            <span className="font-medium text-foreground">
              {format(new Date(invite.expires_at), 'PPP')}
            </span>
            <span className="text-muted-foreground">
              ({formatDistanceToNow(new Date(invite.expires_at), { addSuffix: true })})
            </span>
          </div>
        )}

        {/* Quick Actions */}
        {invite.is_active && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onInvalidate(invite.id!)}
              disabled={isInvalidating}
              className="text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/50 glass-morphism bg-destructive/5 hover:bg-destructive/10"
            >
              {isInvalidating ? (
                <>
                  <div className="h-3 w-3 mr-2 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                  Deactivating...
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-2" />
                  Deactivate
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
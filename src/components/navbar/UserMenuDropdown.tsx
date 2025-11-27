import { User } from "@/models/types";
import { UserRole } from "@/models/types";
import { NetworkPlexus } from "@/components/ui/network-score-badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface UserMenuDropdownProps {
  currentUser: User;
  isAdmin: boolean;
}

const UserMenuDropdown = ({ currentUser, isAdmin }: UserMenuDropdownProps) => {
  const navigate = useNavigate();
  
  const { data: unreadCount = 0, refetch } = useQuery({
    queryKey: ['unread-notifications', currentUser.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('cross_platform_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.id)
        .eq('is_read', false);
      
      if (error) throw error;
      return count || 0;
    },
    refetchOnMount: true,
    staleTime: 0
  });

  useEffect(() => {
    const channel = supabase
      .channel('notification-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cross_platform_notifications',
          filter: `user_id=eq.${currentUser.id}`
        },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser.id, refetch]);

  const handleAvatarClick = () => {
    navigate("/rel8/notifications");
  };

  return (
    <Button 
      variant="ghost" 
      className="relative h-10 w-10 p-0"
      onClick={handleAvatarClick}
    >
      <div className="h-full w-full flex items-center justify-center">
        <NetworkPlexus />
      </div>
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
};

export default UserMenuDropdown;

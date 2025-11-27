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
const UserMenuDropdown = ({
  currentUser,
  isAdmin
}: UserMenuDropdownProps) => {
  const navigate = useNavigate();
  const {
    data: unreadCount = 0,
    refetch
  } = useQuery({
    queryKey: ['unread-notifications', currentUser.id],
    queryFn: async () => {
      const {
        count,
        error
      } = await supabase.from('cross_platform_notifications').select('*', {
        count: 'exact',
        head: true
      }).eq('user_id', currentUser.id).eq('is_read', false);
      if (error) throw error;
      return count || 0;
    },
    refetchOnMount: true,
    staleTime: 0
  });
  useEffect(() => {
    const channel = supabase.channel('notification-updates').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'cross_platform_notifications',
      filter: `user_id=eq.${currentUser.id}`
    }, () => refetch()).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser.id, refetch]);
  const handleAvatarClick = () => {
    navigate("/rel8/notifications");
  };
  
  return (
    <div className="relative h-10 w-10 cursor-pointer p-[5px] flex items-center justify-center" onClick={handleAvatarClick}>
      <NetworkPlexus />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
};
export default UserMenuDropdown;
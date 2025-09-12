import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";

export const useUserRefresh = () => {
  const { refreshUser } = useUser();

  const forceUserRefresh = async () => {
    // Clear any cached data
    localStorage.removeItem('should_refresh_user_role');
    
    // Refresh the user session to pick up role changes
    await supabase.auth.refreshSession();
    
    // Refresh user data
    await refreshUser();
    
    // Force a page reload to ensure all components update
    window.location.reload();
  };

  return { forceUserRefresh };
};
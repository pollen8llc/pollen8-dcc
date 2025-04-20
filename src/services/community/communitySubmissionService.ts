
import { CommunityFormData } from "@/schemas/communitySchema";
import { supabase } from "@/integrations/supabase/client";

export async function submitCommunity(data: CommunityFormData, addDebugLog: (type: 'info' | 'error' | 'success', message: string) => void) {
  addDebugLog('info', 'Starting form submission...');
  
  // Check authentication
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    addDebugLog('error', `Authentication error: ${sessionError.message}`);
    throw new Error(`Authentication error: ${sessionError.message}`);
  }
  
  if (!sessionData?.session?.user) {
    addDebugLog('error', 'No authenticated session found');
    throw new Error("You must be logged in to create a community");
  }

  const userId = sessionData.session.user.id;
  addDebugLog('info', `Authenticated as user: ${userId}`);
  
  // Check user roles using the get_user_roles RPC function
  addDebugLog('info', 'Checking user roles...');
  const { data: roles, error: rolesError } = await supabase.rpc(
    'get_user_roles',
    { user_id: userId }
  );
  
  if (rolesError) {
    addDebugLog('error', `Error checking roles: ${rolesError.message}`);
    throw new Error(`Error checking roles: ${rolesError.message}`);
  }

  addDebugLog('info', `User roles: ${JSON.stringify(roles)}`);
  
  // Determine if user has the required roles
  const hasPermission = roles && Array.isArray(roles) && roles.some(role => 
    role === 'ADMIN' || role === 'ORGANIZER'
  );
  
  if (!hasPermission) {
    addDebugLog('error', 'User lacks necessary permissions');
    throw new Error("You don't have permission to create a community. Required role: ADMIN or ORGANIZER");
  }

  addDebugLog('success', 'User has proper permissions');
  addDebugLog('info', 'Processing form data...');

  // Process the target audience into an array
  const targetAudienceArray = data.targetAudience
    ? data.targetAudience.split(',').map(item => item.trim()).filter(item => item.length > 0)
    : [];

  // Process the platforms into a structured object
  const communicationPlatforms = (data.platforms || []).reduce((acc, platform) => {
    acc[platform] = { enabled: true };
    return acc;
  }, {} as Record<string, any>);

  addDebugLog('info', 'Inserting community into database...');

  // Insert the community
  const { data: community, error } = await supabase
    .from('communities')
    .insert({
      name: data.name,
      description: data.description,
      type: data.type,
      format: data.format,
      location: data.location || 'Remote',
      target_audience: targetAudienceArray,
      communication_platforms: communicationPlatforms,
      website: data.website || null,
      newsletter_url: data.newsletterUrl || null,
      social_media: data.socialMediaHandles || {},
      owner_id: userId,
      is_public: true,
      member_count: 1 // Starting with the owner
    })
    .select()
    .single();

  if (error) {
    addDebugLog('error', `Database insertion error: ${error.message}`);
    throw new Error(`Database error: ${error.message}`);
  }

  if (!community) {
    addDebugLog('error', 'No data returned from insertion');
    throw new Error("Failed to create community: No data returned");
  }

  addDebugLog('success', `Community created successfully with ID: ${community.id}`);
  
  return community;
}


import { CommunityFormData } from "@/schemas/communitySchema";
import { supabase } from "@/integrations/supabase/client";

export async function submitCommunity(data: CommunityFormData, addDebugLog: (type: 'info' | 'error' | 'success', message: string) => void) {
  addDebugLog('info', 'Starting form submission...');
  
  // Check authentication
  const { data: session, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    throw new Error(`Authentication error: ${sessionError.message}`);
  }
  
  if (!session?.session?.user) {
    throw new Error("You must be logged in to create a community");
  }

  addDebugLog('info', 'Checking user roles...');
  
  // Use the RPC function to check roles safely without accessing auth.users directly
  const { data: roles, error: rolesError } = await supabase.rpc(
    'get_user_roles',
    { user_id: session.session.user.id }
  );
  
  if (rolesError) {
    throw new Error(`Error checking roles: ${rolesError.message}`);
  }

  addDebugLog('info', `Found roles: ${JSON.stringify(roles)}`);
  
  // Determine if user has the required roles
  const hasPermission = roles && roles.some(role => 
    role === 'ADMIN' || role === 'ORGANIZER'
  );
  
  if (!hasPermission) {
    throw new Error("You don't have permission to create a community. Required role: ADMIN or ORGANIZER");
  }

  addDebugLog('success', 'User has proper permissions');
  addDebugLog('info', 'Processing form data...');

  // Process the target audience into an array
  const targetAudienceArray = data.targetAudience
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  // Process the platforms into an object
  const communicationPlatforms = data.platforms.reduce((acc, platform) => {
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
      location: data.location,
      target_audience: targetAudienceArray,
      communication_platforms: communicationPlatforms,
      website: data.website || null,
      newsletter_url: data.newsletterUrl || null,
      social_media: data.socialMediaHandles || {},
      owner_id: session.session.user.id,
      is_public: true,
      member_count: 1
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  if (!community) {
    throw new Error("Failed to create community: No data returned");
  }

  addDebugLog('success', `Community created successfully with ID: ${community.id}`);
  
  return community;
}

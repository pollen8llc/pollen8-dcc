import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { contactId, classification, notes } = await req.json();

    console.log('Promoting contact to member:', { contactId, classification });

    // Get contact details from REL8
    const { data: contact, error: contactError } = await supabaseAdmin
      .from('rms_contacts')
      .select('*, user_id')
      .eq('id', contactId)
      .single();

    if (contactError || !contact) {
      console.error('Contact not found:', contactError);
      return new Response(
        JSON.stringify({ error: 'Contact not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists with this email
    const { data: existingUsers, error: userCheckError } = await supabaseAdmin.auth.admin.listUsers();
    
    let authUser = null;
    let isNewUser = false;
    
    if (existingUsers?.users) {
      authUser = existingUsers.users.find(user => user.email === contact.email);
    }

    if (!authUser) {
      // Create new user in Supabase Auth with a random password
      const tempPassword = crypto.randomUUID();
      const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: contact.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          first_name: contact.first_name || contact.name?.split(' ')[0] || '',
          last_name: contact.last_name || contact.name?.split(' ').slice(1).join(' ') || '',
          full_name: contact.name || `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        throw new Error(`Failed to create user: ${authError.message}`);
      }

      authUser = newAuthUser.user;
      isNewUser = true;
      console.log('New auth user created:', authUser?.id);
    } else {
      console.log('Existing user found:', authUser.id);
    }

    if (!authUser) {
      throw new Error('Failed to get or create user');
    }

    // Create or update profile with invited_by field
    const profileData = {
      user_id: authUser.id,
      email: contact.email,
      first_name: contact.first_name || contact.name?.split(' ')[0] || '',
      last_name: contact.last_name || contact.name?.split(' ').slice(1).join(' ') || '',
      full_name: contact.name || `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
      phone: contact.phone,
      location: contact.location,
      bio: notes || contact.notes,
      role: 'MEMBER',
      invited_by: contact.user_id // Set the organizer who invited them
    };

    if (isNewUser) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert(profileData);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }
      console.log('Profile created successfully');
    } else {
      // Update existing profile with invited_by
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ invited_by: contact.user_id })
        .eq('user_id', authUser.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
    }

    // Assign MEMBER role if new user
    if (isNewUser) {
      const { data: memberRole } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'MEMBER')
        .single();

      if (memberRole) {
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: authUser.id,
            role_id: memberRole.id,
            assigned_by: authUser.id
          });

        if (roleError) {
          console.error('Error assigning role:', roleError);
        }
      }
    }

    // Create nmn8 profile
    const { error: nmn8ProfileError } = await supabaseAdmin
      .from('nmn8_profiles')
      .insert({
        contact_id: contactId,
        organizer_id: contact.user_id, // The organizer who had this contact
        classification: classification || 'Volunteer'
      });

    if (nmn8ProfileError) {
      console.error('Error creating nmn8 profile:', nmn8ProfileError);
    }

    // Update any existing nominations
    const { error: nominationUpdateError } = await supabaseAdmin
      .from('nmn8_nominations')
      .update({ 
        notes: notes ? `${notes}\n\nPromoted to member on ${new Date().toISOString()}` : `Promoted to member on ${new Date().toISOString()}`
      })
      .eq('contact_id', contactId)
      .eq('organizer_id', contact.user_id);

    if (nominationUpdateError) {
      console.error('Error updating nominations:', nominationUpdateError);
    }

    // Log the action
    const { error: auditError } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        action: 'promote_contact_to_member',
        performed_by: contact.user_id,
        details: {
          contact_id: contactId,
          new_user_id: authUser.id,
          existing_user: !isNewUser,
          classification: classification || 'Volunteer',
          notes: notes || ''
        }
      });

    if (auditError) {
      console.error('Error logging audit:', auditError);
    }

    console.log('Contact promoted successfully');

    return new Response(
      JSON.stringify({
        success: true,
        userId: authUser.id,
        email: contact.email,
        existing_user: !isNewUser,
        message: `${contact.name} has been ${isNewUser ? 'promoted to member' : 'linked to existing member'} with ${classification} classification`,
        ...(isNewUser && { temporaryPassword: 'Temporary password set - user should reset' })
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in promote-to-member function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
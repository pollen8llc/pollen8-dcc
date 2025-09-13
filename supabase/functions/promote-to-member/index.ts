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

    // Generate a random password
    const randomPassword = crypto.randomUUID().slice(0, 12);

    console.log('Creating auth user for:', contact.email);

    // Create auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: contact.email,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        first_name: contact.name.split(' ')[0] || '',
        last_name: contact.name.split(' ').slice(1).join(' ') || '',
        role: 'MEMBER'
      }
    });

    if (authError || !authUser.user) {
      console.error('Failed to create auth user:', authError);
      return new Response(
        JSON.stringify({ error: 'Failed to create user account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Auth user created:', authUser.user.id);

    // Create profile with organizer reference
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authUser.user.id,
        user_id: authUser.user.id,
        email: contact.email,
        first_name: contact.name.split(' ')[0] || '',
        last_name: contact.name.split(' ').slice(1).join(' ') || '',
        phone: contact.phone,
        location: contact.location,
        bio: notes || contact.notes,
        invited_by: contact.user_id // Associate with the organizer who nominated them
      });

    if (profileError) {
      console.error('Failed to create profile:', profileError);
      // Continue even if profile creation fails
    }

    // Assign MEMBER role
    const { data: memberRole } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', 'MEMBER')
      .single();

    if (memberRole) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: authUser.user.id,
          role_id: memberRole.id,
          assigned_by: authUser.user.id
        });

      if (roleError) {
        console.error('Failed to assign role:', roleError);
      } else {
        console.log('MEMBER role assigned successfully');
      }
    }

    // Create Nomin8 profile for tracking
    console.log('Creating Nomin8 profile for promoted member');
    const { error: nmn8ProfileError } = await supabaseAdmin
      .from('nmn8_profiles')
      .insert({
        contact_id: contactId,
        organizer_id: contact.user_id,
        classification: classification || 'Volunteer',
        community_engagement: 0,
        events_attended: 0,
        interests: [],
        notes: notes || contact.notes
      });

    if (nmn8ProfileError) {
      console.error('Failed to create Nomin8 profile:', nmn8ProfileError);
    } else {
      console.log('Nomin8 profile created successfully');
    }

    // Update existing nomination to mark as promoted (if exists)
    const { error: nominationUpdateError } = await supabaseAdmin
      .from('nmn8_nominations')
      .update({
        notes: `${notes || ''}\n\nPromoted to member on ${new Date().toISOString()}`,
        updated_at: new Date().toISOString()
      })
      .eq('contact_id', contactId)
      .eq('organizer_id', contact.user_id);

    if (nominationUpdateError) {
      console.log('No existing nomination found or failed to update:', nominationUpdateError);
    } else {
      console.log('Updated existing nomination with promotion status');
    }

    // Log the promotion action
    const { error: auditError } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        action: 'contact_promoted_to_member',
        performed_by: authUser.user.id,
        target_user_id: authUser.user.id,
        details: {
          contact_id: contactId,
          contact_name: contact.name,
          contact_email: contact.email,
          classification: classification,
          generated_password: randomPassword, // Note: In production, don't log passwords
          promotion_timestamp: new Date().toISOString()
        }
      });

    if (auditError) {
      console.error('Failed to log audit action:', auditError);
    }

    console.log('Contact promoted successfully');

    return new Response(
      JSON.stringify({
        success: true,
        userId: authUser.user.id,
        email: contact.email,
        temporaryPassword: randomPassword,
        message: `${contact.name} has been promoted to member with ${classification} classification`
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
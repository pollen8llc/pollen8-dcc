import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleContact {
  resourceName: string;
  names?: Array<{ displayName?: string; givenName?: string; familyName?: string }>;
  emailAddresses?: Array<{ value?: string; type?: string }>;
  phoneNumbers?: Array<{ value?: string; type?: string }>;
  organizations?: Array<{ name?: string; title?: string; department?: string }>;
  addresses?: Array<{ formattedValue?: string; city?: string; country?: string }>;
  biographies?: Array<{ value?: string }>;
  birthdays?: Array<{ date?: { year?: number; month?: number; day?: number } }>;
}

interface ContactData {
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  location?: string;
  bio?: string;
  birthday?: string;
  preferred_name?: string;
  source: string;
  status: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authenticated user from JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Get user's active Google integration
    const { data: integration, error: integrationError } = await supabase
      .from('google_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      throw new Error('No active Google integration found. Please connect your Google account first.');
    }

    // Check if token is expired and needs refresh
    let accessToken = integration.access_token;
    const tokenExpiresAt = new Date(integration.token_expires_at);
    
    if (tokenExpiresAt < new Date()) {
      console.log('Access token expired, attempting refresh...');
      
      if (!integration.refresh_token) {
        throw new Error('Access token expired and no refresh token available. Please reconnect your Google account.');
      }

      const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
      const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: clientId ?? '',
          client_secret: clientSecret ?? '',
          refresh_token: integration.refresh_token,
        }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh access token. Please reconnect your Google account.');
      }

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;
      
      // Update stored token
      await supabase
        .from('google_integrations')
        .update({
          access_token: accessToken,
          token_expires_at: new Date(Date.now() + (refreshData.expires_in * 1000)).toISOString(),
        })
        .eq('id', integration.id);
    }

    // Fetch contacts from Google People API
    console.log('Fetching contacts from Google People API...');
    
    const personFields = 'names,emailAddresses,phoneNumbers,organizations,addresses,biographies,birthdays';
    let allContacts: GoogleContact[] = [];
    let nextPageToken: string | undefined;

    do {
      const url = new URL('https://people.googleapis.com/v1/people/me/connections');
      url.searchParams.set('personFields', personFields);
      url.searchParams.set('pageSize', '1000');
      if (nextPageToken) {
        url.searchParams.set('pageToken', nextPageToken);
      }

      const contactsResponse = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!contactsResponse.ok) {
        const errorText = await contactsResponse.text();
        console.error('People API error:', errorText);
        throw new Error('Failed to fetch contacts from Google');
      }

      const contactsData = await contactsResponse.json();
      
      if (contactsData.connections) {
        allContacts = [...allContacts, ...contactsData.connections];
      }
      
      nextPageToken = contactsData.nextPageToken;
    } while (nextPageToken);

    console.log(`Fetched ${allContacts.length} contacts from Google`);

    // Get existing contacts for duplicate detection
    const { data: existingContacts } = await supabase
      .from('rms_contacts')
      .select('email')
      .eq('user_id', user.id);

    const existingEmails = new Set(
      existingContacts?.map((c: { email?: string }) => c.email?.toLowerCase()).filter(Boolean) || []
    );

    // Process and import contacts
    let importedCount = 0;
    let duplicatesCount = 0;
    let errorsCount = 0;
    const importedContacts: string[] = [];
    const skippedDuplicates: string[] = [];

    for (const contact of allContacts) {
      try {
        const name = contact.names?.[0]?.displayName;
        const email = contact.emailAddresses?.[0]?.value;
        
        // Skip contacts without a name
        if (!name) {
          continue;
        }

        // Check for duplicates by email
        if (email && existingEmails.has(email.toLowerCase())) {
          duplicatesCount++;
          skippedDuplicates.push(email);
          continue;
        }

        // Format birthday if present
        let birthday: string | undefined;
        if (contact.birthdays?.[0]?.date) {
          const bday = contact.birthdays[0].date;
          if (bday.year && bday.month && bday.day) {
            birthday = `${bday.year}-${String(bday.month).padStart(2, '0')}-${String(bday.day).padStart(2, '0')}`;
          }
        }

        const contactData: ContactData = {
          user_id: user.id,
          name: name,
          email: email || undefined,
          phone: contact.phoneNumbers?.[0]?.value || undefined,
          organization: contact.organizations?.[0]?.name || undefined,
          role: contact.organizations?.[0]?.title || undefined,
          location: contact.addresses?.[0]?.formattedValue || undefined,
          bio: contact.biographies?.[0]?.value || undefined,
          birthday: birthday,
          preferred_name: contact.names?.[0]?.givenName || undefined,
          source: 'google_contacts',
          status: 'active',
        };

        // Remove undefined values
        const cleanedData = Object.fromEntries(
          Object.entries(contactData).filter(([_, v]) => v !== undefined)
        );

        const { error: insertError } = await supabase
          .from('rms_contacts')
          .insert(cleanedData);

        if (insertError) {
          console.error('Error inserting contact:', insertError);
          errorsCount++;
        } else {
          importedCount++;
          importedContacts.push(name);
          if (email) {
            existingEmails.add(email.toLowerCase());
          }
        }
      } catch (err) {
        console.error('Error processing contact:', err);
        errorsCount++;
      }
    }

    // Update last sync time
    await supabase
      .from('google_integrations')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', integration.id);

    // Record import history
    await supabase
      .from('google_import_history')
      .insert({
        user_id: user.id,
        integration_id: integration.id,
        contacts_imported: importedCount,
        duplicates_found: duplicatesCount,
        errors_count: errorsCount,
        import_status: 'completed',
        import_data: {
          total_fetched: allContacts.length,
          imported_names: importedContacts.slice(0, 10),
          skipped_emails: skippedDuplicates.slice(0, 10),
        },
      });

    // Increment rel8_contacts iota
    if (importedCount > 0) {
      await supabase.rpc('increment_iota_metric', {
        p_user_id: user.id,
        p_metric_type: 'rel8_contacts',
        p_increment: importedCount,
      });
    }

    console.log(`Import complete: ${importedCount} imported, ${duplicatesCount} duplicates, ${errorsCount} errors`);

    return new Response(JSON.stringify({
      success: true,
      summary: {
        total_fetched: allContacts.length,
        imported: importedCount,
        duplicates: duplicatesCount,
        errors: errorsCount,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in google-import-contacts:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

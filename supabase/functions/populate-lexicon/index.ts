import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 100 common interests to populate
const COMMON_INTERESTS = [
  // Technology & Digital
  'Artificial Intelligence', 'Machine Learning', 'Web Development', 'Mobile Apps', 'Blockchain',
  'Cryptocurrency', 'Cybersecurity', 'Data Science', 'Cloud Computing', 'Gaming',
  
  // Creative & Arts
  'Photography', 'Videography', 'Graphic Design', 'Writing', 'Poetry',
  'Music Production', 'Drawing', 'Painting', 'Sculpture', 'Animation',
  
  // Sports & Fitness
  'Running', 'Yoga', 'CrossFit', 'Swimming', 'Cycling',
  'Martial Arts', 'Basketball', 'Soccer', 'Tennis', 'Rock Climbing',
  
  // Business & Entrepreneurship
  'Startups', 'E-commerce', 'Marketing', 'Sales', 'Product Management',
  'Business Strategy', 'Leadership', 'Investing', 'Real Estate', 'Consulting',
  
  // Science & Education
  'Physics', 'Biology', 'Chemistry', 'Astronomy', 'Mathematics',
  'Environmental Science', 'Psychology', 'Philosophy', 'History', 'Teaching',
  
  // Social & Community
  'Volunteering', 'Social Justice', 'Community Building', 'Public Speaking', 'Networking',
  'Mentorship', 'Event Planning', 'Nonprofit Work', 'Activism', 'Fundraising',
  
  // Lifestyle & Wellness
  'Meditation', 'Mindfulness', 'Nutrition', 'Cooking', 'Baking',
  'Gardening', 'Interior Design', 'Fashion', 'Travel', 'Adventure',
  
  // Entertainment & Media
  'Film', 'Television', 'Podcasting', 'Streaming', 'Content Creation',
  'Book Clubs', 'Theater', 'Stand-up Comedy', 'Improv', 'Magic',
  
  // Outdoor & Nature
  'Hiking', 'Camping', 'Fishing', 'Surfing', 'Skiing',
  'Birdwatching', 'Wildlife Conservation', 'Sustainable Living', 'Permaculture', 'Foraging',
  
  // Learning & Development
  'Language Learning', 'Career Development', 'Personal Growth', 'Reading', 'Research',
  'Innovation', 'Design Thinking', 'Problem Solving', 'Critical Thinking', 'Creativity'
];

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { action } = await req.json();

    console.log(`Received action: ${action}`);

    if (action === 'populate_interests') {
      // Populate common interests
      let addedCount = 0;
      let skippedCount = 0;

      for (const interest of COMMON_INTERESTS) {
        // Check if interest already exists
        const { data: existing } = await supabaseClient
          .from('lexicon')
          .select('id')
          .eq('term', interest)
          .eq('term_type', 'interest')
          .maybeSingle();

        if (!existing) {
          const { error: insertError } = await supabaseClient
            .from('lexicon')
            .insert({
              term: interest,
              term_type: 'interest',
              usage_count: 0,
              is_suggested: true,
              is_active: true,
              source_module: 'system',
              metadata: { preloaded: true }
            });

          if (insertError) {
            console.error(`Error inserting interest "${interest}":`, insertError);
          } else {
            addedCount++;
          }
        } else {
          skippedCount++;
        }
      }

      console.log(`Populated interests: ${addedCount} added, ${skippedCount} skipped`);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Populated ${addedCount} interests, ${skippedCount} already existed`,
          addedCount,
          skippedCount
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } 
    
    else if (action === 'sync_existing') {
      // Call the sync function to populate from existing data
      const { data, error } = await supabaseClient.rpc('sync_existing_data_to_lexicon');

      if (error) {
        throw error;
      }

      console.log(`Synced ${data} existing records to lexicon`);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Synced ${data} records from existing data`,
          count: data
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    else {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid action. Use "populate_interests" or "sync_existing"'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

  } catch (error) {
    console.error('Error in populate-lexicon function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

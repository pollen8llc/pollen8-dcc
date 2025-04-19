
import { createClient } from '@supabase/supabase-js';

// Remove dotenv import and use process.env directly
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and key are required in the environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCommunity(communityName: string, userId: string) {
  // When creating a new community, set the owner_id directly
  const newCommunity = {
    name: communityName,
    description: "A community for testing purposes.",
    location: "Virtual",
    is_public: true,
    owner_id: userId // Set the owner directly instead of using community_members
  };

  // Insert the community
  const { data: community, error: communityError } = await supabase
    .from('communities')
    .insert(newCommunity)
    .select()
    .single();

  if (communityError) {
    console.error("Error creating community:", communityError);
    return;
  }

  console.log("Created community:", community);

  // Optionally, log the community creation event
  console.log(`Community "${communityName}" created successfully by user ${userId}.`);
}

async function main() {
  // Replace with the actual user ID and community name
  const userId = 'YOUR_USER_ID'; // Replace with a valid user ID
  const communityName = 'Test Community'; // Replace with the desired community name

  await createCommunity(communityName, userId);
}

main().catch(error => {
  console.error("An error occurred:", error);
});

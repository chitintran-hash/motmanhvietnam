const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearUsers() {
  console.log("Fetching users...");
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error("Error fetching users:", error);
    return;
  }

  console.log(`Found ${users.length} users. Deleting...`);
  
  for (const user of users) {
    // Delete profile first to avoid FK issues
    await supabase.from('profiles').delete().eq('id', user.id);
    
    // Delete auth user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error(`Failed to delete user ${user.email}:`, deleteError);
    } else {
      console.log(`Deleted user: ${user.email}`);
    }
  }
  
  console.log("Cleanup complete!");
}

clearUsers();

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

function createAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) must be set');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const ADMIN_EMAIL = 'dr.ibrahim@dribrahim.clinic';
const ADMIN_PASSWORD = 'admin123';

async function seedAdminAuth() {
  const supabaseAdmin = createAdminClient();

  // Check if auth user already exists
  const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
  const found = existing?.users.find(u => u.email === ADMIN_EMAIL);

  if (found) {
    console.log(`Auth user already exists for ${ADMIN_EMAIL}, updating...`);
    await supabaseAdmin.auth.admin.updateUserById(found.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
  } else {
    console.log(`Creating auth user for ${ADMIN_EMAIL}...`);
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { name: 'Dr. Ibrahim Hossain' },
    });
    if (error) {
      console.error('Error creating user:', error.message);
      process.exit(1);
    }
    console.log(`Created auth user: ${data.user.id}`);
  }

  // Ensure the users table has a matching profile
  const { error: upsertError } = await supabaseAdmin
    .from('users')
    .upsert({
      id: 'U-001',
      email: ADMIN_EMAIL,
      name: 'Dr. Ibrahim Hossain',
      roles: ['admin'],
      permissions: [],
      mfa_enabled: false,
      status: 'Active',
      failed_attempts: 0,
    }, { onConflict: 'id' });

  if (upsertError) {
    console.error('Error upserting profile:', upsertError.message);
  } else {
    console.log('Profile upserted successfully');
  }

  console.log('\nAdmin login credentials:');
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
}

seedAdminAuth().catch(console.error);
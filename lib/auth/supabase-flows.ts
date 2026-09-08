import { createClient } from '@/utils/supabase/client';

const redirectUrl = () => process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`;

export async function signUpPatient(email: string, password: string, fullName: string) {
  const supabase = createClient();
  return supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: redirectUrl(), data: { full_name: fullName.trim(), role: 'patient' } } });
}

export async function signInWithGoogle() {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl(), queryParams: { access_type: 'offline', prompt: 'consent' } } });
}

export async function sendPatientOtp(phone: string) {
  const supabase = createClient();
  return supabase.auth.signInWithOtp({ phone: phone.trim(), options: { shouldCreateUser: true, data: { role: 'patient' } } });
}

export async function verifyPatientOtp(phone: string, token: string) {
  const supabase = createClient();
  return supabase.auth.verifyOtp({ phone: phone.trim(), token: token.trim(), type: 'sms' });
}

export async function sendPasswordRecovery(email: string) {
  const supabase = createClient();
  return supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` });
}

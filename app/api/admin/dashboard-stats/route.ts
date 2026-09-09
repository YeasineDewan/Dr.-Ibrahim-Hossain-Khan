import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function GET() {
  const auth = await requireAdminAuth();
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const supabase = createClient(cookieStore);

    // Get dashboard stats
    const [
      patientsResult,
      appointmentsResult,
      prescriptionsResult,
      followUpsResult,
      reviewsResult,
    ] = await Promise.all([
      supabase.from('patients').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('prescriptions').select('*', { count: 'exact', head: true }),
      supabase.from('follow_ups').select('*', { count: 'exact', head: true }).eq('status', 'Overdue'),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
    ]);

    // Get today's appointments
    const today = new Date().toISOString().split('T')[0];
    const { count: todayAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('date', today);

    // Get pending appointments
    const { count: pendingAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pending');

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get monthly revenue
    const { data: monthlyRevenue } = await supabase
      .from('appointments')
      .select('fee, date')
      .gte('date', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);

    const totalRevenue = monthlyRevenue?.reduce((sum: number, apt: any) => sum + (apt.fee || 0), 0) || 0;

    return NextResponse.json({
      stats: {
        totalPatients: patientsResult.count || 0,
        totalAppointments: appointmentsResult.count || 0,
        totalPrescriptions: prescriptionsResult.count || 0,
        overdueFollowUps: followUpsResult.count || 0,
        totalReviews: reviewsResult.count || 0,
        todayAppointments: todayAppointments || 0,
        pendingAppointments: pendingAppointments || 0,
        monthlyRevenue: totalRevenue,
      },
      recentActivity: recentActivity || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

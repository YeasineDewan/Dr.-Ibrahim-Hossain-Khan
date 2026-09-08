import { createClient } from '@/utils/supabase/client';

const SAMPLE_DATA = {
  patients: [
    {
      id: 'DR-20481',
      name: 'Amara Mensah',
      dob: '1992-04-12',
      gender: 'Female',
      phone: '+233 24 555 0181',
      email: 'amara.m@email.com',
      address: '12 Cantonments, Accra',
      bloodGroup: 'O+',
      allergies: ['Penicillin'],
      conditions: ['Mild eczema'],
      medications: [{ name: 'Moisturizer', dose: 'Daily', status: 'Ongoing' }],
      visits: [{ date: '2026-06-12', reason: 'Skin review', doctor: 'Dr. Ibrahim', notes: 'Stable, continue plan.' }],
      notes: [{ date: '2026-06-12', text: 'Patient responding well to current regimen.', author: 'Dr. Ibrahim' }],
      documents: [{ name: 'Lab report.pdf', type: 'PDF', size: '1.2 MB', date: '2026-06-10' }],
      vitals: { bp: '118/76', hr: '72', temp: '36.7', weight: '64 kg', date: '2026-06-12' },
    },
    // Add more sample patients here...
  ],
  appointments: [
    {
      id: 'APT-001',
      patient_id: 'DR-20481',
      patient_name: 'Amara Mensah',
      doctor: 'Dr. Ibrahim',
      service: 'General consultation',
      chamber: 'Dhanmondi',
      date: '2026-06-18',
      time: '09:00',
      duration: '30 min',
      type: 'In-person',
      status: 'Confirmed',
      fee: 4500,
    },
    // Add more sample appointments here...
  ],
  prescriptions: [
    {
      id: 'RX-001',
      patient_id: 'DR-20481',
      patient_name: 'Amara Mensah',
      doctor: 'Dr. Ibrahim',
      date: '2026-06-12',
      diagnosis: 'Mild eczema flare',
      medicines: [
        { name: 'Moisturizer', dose: 'Apply twice daily', frequency: 'Twice daily', duration: '14 days', instructions: 'Apply after shower on damp skin' },
        { name: 'Hydrocortisone 1%', dose: 'Thin layer', frequency: 'Once daily', duration: '7 days', instructions: 'Apply to affected areas only' },
      ],
      notes: 'Continue current skincare routine. Avoid hot water.',
      status: 'Signed',
      audit_trail: [],
      refill_count: 0,
      refills_allowed: 2,
    },
    // Add more sample prescriptions here...
  ],
};

export async function migrateSampleData() {
  const supabase = createClient();
  
  console.log('Starting migration...');
  
  // Migrate patients
  console.log('Migrating patients...');
  for (const patient of SAMPLE_DATA.patients) {
    const { error } = await supabase.from('patients').upsert(patient);
    if (error) {
      console.error(`Error migrating patient ${patient.id}:`, error.message);
    } else {
      console.log(`✓ Migrated patient ${patient.id}`);
    }
  }
  
  // Migrate appointments
  console.log('Migrating appointments...');
  for (const appointment of SAMPLE_DATA.appointments) {
    const { error } = await supabase.from('appointments').upsert(appointment);
    if (error) {
      console.error(`Error migrating appointment ${appointment.id}:`, error.message);
    } else {
      console.log(`✓ Migrated appointment ${appointment.id}`);
    }
  }
  
  // Migrate prescriptions
  console.log('Migrating prescriptions...');
  for (const prescription of SAMPLE_DATA.prescriptions) {
    const { error } = await supabase.from('prescriptions').upsert(prescription);
    if (error) {
      console.error(`Error migrating prescription ${prescription.id}:`, error.message);
    } else {
      console.log(`✓ Migrated prescription ${prescription.id}`);
    }
  }
  
  console.log('Migration complete!');
}

// Run if executed directly
if (require.main === module) {
  migrateSampleData().catch(console.error);
}

import { renderHook, act } from '@testing-library/react';
import { useAdminData, type Patient, type Appointment, type Prescription } from './admin-data';
import { TODAY } from './utils';

const flushStorage = () => {
  window.sessionStorage.clear();
};

beforeEach(() => flushStorage);

describe('useAdminData', () => {
  it('initializes with sample patients', () => {
    const { result } = renderHook(() => useAdminData());
    expect(result.current.patients.length).toBe(12);
  });

  it('initializes with sample appointments', () => {
    const { result } = renderHook(() => useAdminData());
    expect(result.current.appointments.length).toBe(10);
  });

  it('initializes with sample prescriptions', () => {
    const { result } = renderHook(() => useAdminData());
    expect(result.current.prescriptions.length).toBe(3);
  });

  it('addPatient upserts by ID (new)', () => {
    const { result } = renderHook(() => useAdminData());
    const before = result.current.patients.length;
    const newPatient: Patient = {
      id: 'TEST-001',
      name: 'Test User',
      dob: '1990-01-01',
      gender: 'Other',
      phone: '555-1234',
      email: 'test@test.com',
      address: '123 Test St',
      bloodGroup: 'O+',
      allergies: [],
      conditions: [],
      medications: [],
      visits: [],
      notes: [],
      documents: [],
      vitals: { bp: '', hr: '', temp: '', weight: '', date: TODAY },
    };
    act(() => result.current.addPatient(newPatient));
    expect(result.current.patients.length).toBe(before + 1);
    expect(result.current.patients.find(p => p.id === 'TEST-001')).toBeTruthy();
  });

  it('addPatient upserts by ID (update existing)', () => {
    const { result } = renderHook(() => useAdminData());
    const existingId = result.current.patients[0].id;
    const updated: Patient = {
      ...result.current.patients[0],
      name: 'Updated Name',
    };
    act(() => result.current.addPatient(updated));
    expect(result.current.patients.length).toBe(12);
    expect(result.current.patients.find(p => p.id === existingId)?.name).toBe('Updated Name');
  });

  it('removePatient deletes by ID', () => {
    const { result } = renderHook(() => useAdminData());
    const targetId = result.current.patients[0].id;
    const before = result.current.patients.length;
    act(() => result.current.removePatient(targetId));
    expect(result.current.patients.length).toBe(before - 1);
    expect(result.current.patients.find(p => p.id === targetId)).toBeUndefined();
  });

  it('addAppointment creates with new ID', () => {
    const { result } = renderHook(() => useAdminData());
    const before = result.current.appointments.length;
    const newAppt: Appointment = {
      id: 'APT-999',
      patient: 'Test Patient',
      doctor: 'Dr. Ibrahim',
      service: 'General consultation',
      chamber: 'Dhanmondi',
      date: '2026-06-25',
      time: '10:00',
      duration: '30 min',
      type: 'In-person',
      status: 'Pending',
      fee: 4500,
    };
    act(() => result.current.addAppointment(newAppt));
    expect(result.current.appointments.length).toBe(before + 1);
  });

  it('addPrescription creates with new ID', () => {
    const { result } = renderHook(() => useAdminData());
    const before = result.current.prescriptions.length;
    const newRx: Prescription = {
      id: '',
      patientId: 'DR-20481',
      patientName: 'Amara Mensah',
      doctor: 'Dr. Ibrahim',
      date: TODAY,
      diagnosis: 'Test diagnosis',
      medicines: [
        {
          name: 'Test med',
          dose: '1mg',
          frequency: 'Once daily',
          duration: '7 days',
          instructions: '',
        },
      ],
      notes: '',
      status: 'Draft',
      createdAt: '2026-06-18T10:00:00Z',
      refillCount: 0,
      refillsAllowed: 0,
      auditTrail: [],
    };
    act(() => result.current.addPrescription(newRx));
    expect(result.current.prescriptions.length).toBe(before + 1);
  });

  it('logActivity prepends a new entry', () => {
    const { result } = renderHook(() => useAdminData());
    const before = result.current.activity.length;
    act(() => result.current.logActivity('Test User', 'created', 'Test entry'));
    expect(result.current.activity.length).toBe(before + 1);
    expect(result.current.activity[0].user).toBe('Test User');
    expect(result.current.activity[0].action).toBe('created');
    expect(result.current.activity[0].target).toBe('Test entry');
  });

  it('persists appointments to sessionStorage', () => {
    const { result } = renderHook(() => useAdminData());
    act(() => {
      result.current.addAppointment({
        id: 'APT-PERSIST',
        patient: 'Persist Test',
        doctor: 'Dr. Ibrahim',
        service: 'Test',
        chamber: 'Dhanmondi',
        date: '2026-06-25',
        time: '11:00',
        duration: '30 min',
        type: 'In-person',
        status: 'Confirmed',
        fee: 5000,
      });
    });
    const saved = window.sessionStorage.getItem('dribrahim.admin.content');
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved!);
    expect(parsed.appointments.find((a: any) => a.id === 'APT-PERSIST')).toBeTruthy();
  });
});

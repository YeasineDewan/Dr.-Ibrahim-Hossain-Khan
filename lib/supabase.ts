export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string;
          name: string;
          dob: string;
          gender: string;
          phone: string;
          email: string | null;
          address: string | null;
          blood_group: string | null;
          allergies: string[];
          conditions: string[];
          medications: any[];
          visits: any[];
          notes: any[];
          documents: any[];
          vitals: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          dob: string;
          gender: string;
          phone: string;
          email?: string | null;
          address?: string | null;
          blood_group?: string | null;
          allergies?: string[];
          conditions?: string[];
          medications?: any[];
          visits?: any[];
          notes?: any[];
          documents?: any[];
          vitals?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          dob?: string;
          gender?: string;
          phone?: string;
          email?: string | null;
          address?: string | null;
          blood_group?: string | null;
          allergies?: string[];
          conditions?: string[];
          medications?: any[];
          visits?: any[];
          notes?: any[];
          documents?: any[];
          vitals?: any;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          patient_name: string;
          doctor: string;
          service: string;
          chamber: string;
          date: string;
          time: string;
          duration: string;
          type: string;
          status: string;
          fee: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          patient_name: string;
          doctor?: string;
          service: string;
          chamber: string;
          date: string;
          time: string;
          duration: string;
          type?: string;
          status?: string;
          fee?: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          patient_id?: string;
          patient_name?: string;
          doctor?: string;
          service?: string;
          chamber?: string;
          date?: string;
          time?: string;
          duration?: string;
          type?: string;
          status?: string;
          fee?: number;
          notes?: string | null;
        };
      };
      prescriptions: {
        Row: {
          id: string;
          patient_id: string;
          patient_name: string;
          doctor: string;
          date: string;
          diagnosis: string;
          medicines: any[];
          notes: string | null;
          status: string;
          visit_id?: string;
          signature_data_url?: string;
          signed_at?: string;
          sent_at?: string;
          audit_trail: any[];
          refill_count: number;
          refills_allowed: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          patient_name: string;
          doctor?: string;
          date: string;
          diagnosis: string;
          medicines: any[];
          notes?: string | null;
          status?: string;
          visit_id?: string;
          signature_data_url?: string;
          audit_trail?: any[];
          refill_count?: number;
          refills_allowed?: number;
        };
      };
      follow_ups: {
        Row: {
          id: string;
          patient_id: string;
          patient_name: string;
          reason: string;
          due_date: string;
          status: string;
          priority: string;
          assigned_to: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          patient_name: string;
          reason: string;
          due_date: string;
          status?: string;
          priority?: string;
          assigned_to?: string;
        };
      };
      chambers: {
        Row: {
          id: string;
          name: string;
          place: string;
          address: string;
          hours: string;
          phone: string;
          email?: string;
          status: string;
          capacity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          place: string;
          address: string;
          hours: string;
          phone: string;
          email?: string;
          status?: string;
          capacity?: number;
        };
      };
      reviews: {
        Row: {
          id: string;
          author: string;
          service: string;
          rating: number;
          text: string;
          date: string;
          status: string;
          reply?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          author: string;
          service: string;
          rating: number;
          text: string;
          date: string;
          status?: string;
          reply?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          type: string;
          title: string;
          body: string;
          time: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          title: string;
          body: string;
          time: string;
          read?: boolean;
        };
      };
      activity_log: {
        Row: {
          id: string;
          user: string;
          action: string;
          target: string;
          time: string;
          ip?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user: string;
          action: string;
          target: string;
          time: string;
          ip?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          roles: string[];
          permissions: any[];
          mfa_enabled: boolean;
          status: string;
          last_login?: string;
          failed_attempts: number;
          locked_until?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          roles?: string[];
          permissions?: any[];
          mfa_enabled?: boolean;
          status?: string;
          failed_attempts?: number;
        };
      };
      gallery: {
        Row: {
          id: string;
          url: string;
          title: string;
          album: string;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          title: string;
          album: string;
          date: string;
        };
      };
      videos: {
        Row: {
          id: string;
          title: string;
          title_bn?: string;
          thumbnail: string;
          duration: string;
          views: number;
          status: string;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_bn?: string;
          thumbnail: string;
          duration: string;
          views?: number;
          status?: string;
          date: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          products: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          products?: number;
          status?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: string;
          value: number;
          min_order: number;
          uses: number;
          max_uses: number;
          expiry: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: string;
          value: number;
          min_order?: number;
          uses?: number;
          max_uses?: number;
          expiry: string;
          status?: string;
        };
      };
    };
  };
}

export type Tables = Database['public']['Tables'];

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for common Supabase operations
export const supabaseAuth = {
  signUp: async (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  },
  
  signIn: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  },
  
  signOut: async () => {
    return supabase.auth.signOut();
  },
  
  getSession: async () => {
    return supabase.auth.getSession();
  },
  
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export const supabaseDb = {
  // Profiles
  getProfile: async (userId: string) => {
    return supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  },
  
  createProfile: async (profile: Database['public']['Tables']['profiles']['Insert']) => {
    return supabase
      .from('profiles')
      .insert(profile);
  },
  
  updateProfile: async (userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
    return supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
  },
  
  // Reports
  getReports: async (userId: string) => {
    return supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },
  
  getReport: async (reportId: string) => {
    return supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();
  },
  
  createReport: async (report: Database['public']['Tables']['reports']['Insert']) => {
    return supabase
      .from('reports')
      .insert(report)
      .select()
      .single();
  },
  
  // Report Images
  getReportImages: async (reportId: string) => {
    return supabase
      .from('report_images')
      .select('*')
      .eq('report_id', reportId);
  },
  
  createReportImage: async (image: Database['public']['Tables']['report_images']['Insert']) => {
    return supabase
      .from('report_images')
      .insert(image);
  },
  
  // Storage
  uploadImage: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    const { error, data } = await supabase.storage
      .from('report-images')
      .upload(filePath, file);
      
    if (error) {
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('report-images')
      .getPublicUrl(filePath);
      
    return publicUrl;
  }
};

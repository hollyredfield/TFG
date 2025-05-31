import { createClient } from '@supabase/supabase-js';

// Valores por defecto para desarrollo local
const defaultSupabaseUrl = 'https://qatzosrzygyndyfkdbum.supabase.co';
const defaultSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdHpvc3J6eWd5bmR5ZmtkYnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDI1NjgsImV4cCI6MjA2MjYxODU2OH0.9xZ7rePOsYSVZodvjlWUwwWlu3tSxVvZ20Gi6r_T2vI';

// Intentar obtener de variables de entorno o usar valores por defecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultSupabaseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultSupabaseKey;

console.log('[supabaseClient] 🔑 Configurando cliente con URL:', supabaseUrl.substring(0, 15) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Log para confirmar inicialización
console.log('[supabaseClient] 🔄 Cliente Supabase inicializado');

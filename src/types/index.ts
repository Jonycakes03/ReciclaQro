import { Session, User } from '@supabase/supabase-js';

// -------------------------------------------------------------
// Entidades de la Base de Datos (Supabase)
// -------------------------------------------------------------

export interface Usuario {
  id: string;
  email: string;
  nombre?: string;
  nivel: number;
  xp: number;
  avatar_url?: string;
  created_at: string;
}

export interface CentroAcopio {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  materiales: string[];
  horario: string;
  telefono?: string;
  responsable?: string;
  municipio?: string;
  activo?: boolean;
  distancia_km?: number; // Calculado mediante RPC de PostGIS
  created_at?: string;
}

export interface MaterialEducativo {
  id: string;
  titulo: string;
  slug?: string;
  contenido: string;
  resumen?: string;
  categoria: string;
  tiempo_lectura?: string;
  imagen_url?: string;
  creado_en: string;
}

// Alias para compatibilidad
export type Articulo = MaterialEducativo;

export interface RegistroReciclaje {
  id: string;
  usuario_id: string;
  centro_acopio_id: string;
  centro_nombre?: string;
  materiales: string[];
  xp_ganada: number;
  peso_kg?: number;
  fecha: string;
  notas?: string;
}

export interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  requisito_xp: number;
  desbloqueado?: boolean;
}

// -------------------------------------------------------------
// Categorías RAEE (Residuos de Aparatos Eléctricos y Electrónicos)
// -------------------------------------------------------------

export type CategoriaRAEE = 
  | 'todos'
  | 'computo'          // Laptops, PCs, tablets, periféricos
  | 'telefonia'        // Celulares, smartphones, cargadores
  | 'baterias'         // Pilas, baterías litio, powerbanks
  | 'linea_blanca'     // Refrigeradores, lavadoras, microondas
  | 'audio_video'      // Televisores, monitores, bocinas
  | 'cables_pequenos'; // Cables, transformadores, pequeños enseres

export interface InfoCategoriaRAEE {
  id: CategoriaRAEE;
  nombre: string;
  icono: string;
  descripcion: string;
  xpBase: number;
}

// -------------------------------------------------------------
// Contexto de Autenticación
// -------------------------------------------------------------

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Usuario | null;
  isLoading: boolean;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signInWithEmail: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

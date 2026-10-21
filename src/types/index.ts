import { Session, User } from '@supabase/supabase-js';
import type {
  Usuario,
  CentroAcopio,
  MaterialEducativo,
  RegistroReciclaje,
} from './database';

// -------------------------------------------------------------
// Entidades de la Base de Datos (fuente de verdad: ./database.ts)
// -------------------------------------------------------------

export type { Usuario, CentroAcopio, MaterialEducativo, RegistroReciclaje };

// Alias para compatibilidad
export type Articulo = MaterialEducativo;

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
// Respuestas de la API interna
// -------------------------------------------------------------

export interface PerfilResponse {
  usuario: Usuario;
  historial?: RegistroReciclaje[];
}

export interface CrearPerfilInput {
  nombre?: string;
}

export interface CrearPerfilResponse {
  usuario: Usuario;
}

export interface RegistrarReciclajeInput {
  id_centro: string | null;
  tipo_aparato: string;
  xp_otorgada: number;
}

export interface RegistrarReciclajeResponse {
  registro: RegistroReciclaje;
  usuario: Pick<Usuario, 'id' | 'nombre' | 'email' | 'experiencia_xp' | 'nivel_actual'>;
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
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
  setPassword: (password: string) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

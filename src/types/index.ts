export interface Usuario {
  id: string;
  email: string;
  nombre?: string;
  nivel: number;
  xp: number;
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
}

export interface Articulo {
  id: string;
  titulo: string;
  contenido: string;
  categoria: string;
  creado_en: string;
}

export interface RegistroReciclaje {
  id: string;
  usuario_id: string;
  centro_acopio_id: string;
  materiales: string[];
  xp_ganada: number;
  fecha: string;
}

export interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  requisito_xp: number;
}

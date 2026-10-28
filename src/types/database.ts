/**
 * Tipos del esquema `public` de Supabase para ReciclaQro.
 * Reflejan exactamente las columnas de producción.
 *
 * Nota: se usan `type` (no `interface`) en las filas porque supabase-js exige que
 * `Row` sea asignable a `Record<string, unknown>`; las interfaces no lo cumplen.
 */

// ---------------------------------------------------------------------------
// Tipos auxiliares
// ---------------------------------------------------------------------------

/** Geometría para insertar/actualizar columnas PostGIS desde GeoJSON. */
export type GeoJSONPoint = {
  type: 'Point';
  /** [longitud, latitud] */
  coordinates: [number, number];
};

// ---------------------------------------------------------------------------
// public.spatial_ref_sys (tabla de la extensión PostGIS)
// ---------------------------------------------------------------------------

export type SpatialRefSys = {
  srid: number;
  auth_name: string | null;
  auth_srid: number | null;
  srtext: string | null;
  proj4text: string | null;
};

// ---------------------------------------------------------------------------
// public.usuarios
// ---------------------------------------------------------------------------

export type Usuario = {
  id: string; // uuid, FK -> auth.users.id
  nombre: string | null;
  email: string;
  experiencia_xp: number | null; // DEFAULT 0
  nivel_actual: number | null; // DEFAULT 1
  fecha_registro: string; // timestamptz (ISO 8601)
};

export type UsuarioInsert = {
  id: string;
  email: string;
  nombre?: string | null;
  experiencia_xp?: number | null;
  nivel_actual?: number | null;
  fecha_registro?: string;
};

export type UsuarioUpdate = Partial<UsuarioInsert>;

// ---------------------------------------------------------------------------
// public.centros_acopio
// ---------------------------------------------------------------------------

export type CentroAcopio = {
  id: string; // uuid
  nombre: string;
  direccion: string | null;
  /**
   * Al LEER, PostgREST devuelve la columna PostGIS como EWKB hexadecimal
   * (p. ej. "0101000020E6100000..."). Usa `parseUbicacion()` de `@/lib/geo`.
   */
  ubicacion: string;
  horarios: string | null;
  categorias_aceptadas: string[];
  activo: boolean | null; // DEFAULT true
};

export type CentroAcopioInsert = {
  id?: string;
  nombre: string;
  direccion?: string | null;
  ubicacion: GeoJSONPoint | string; // GeoJSON o WKT/EWKT al insertar
  horarios?: string | null;
  categorias_aceptadas: string[];
  activo?: boolean | null;
};

export type CentroAcopioUpdate = Partial<CentroAcopioInsert>;

/** Centro con coordenadas ya decodificadas, tal como lo entrega GET /api/centros. */
export type CentroAcopioMapa = Omit<CentroAcopio, 'ubicacion'> & {
  lat: number;
  lng: number;
};

// ---------------------------------------------------------------------------
// public.registros_reciclaje
// ---------------------------------------------------------------------------

export type RegistroReciclaje = {
  id: string; // uuid
  id_usuario: string; // FK -> usuarios.id
  id_centro: string | null; // FK -> centros_acopio.id
  tipo_aparato: string;
  xp_otorgada: number;
  fecha_entrega: string; // timestamptz (ISO 8601)
};

export type RegistroReciclajeInsert = {
  id?: string;
  id_usuario: string;
  id_centro?: string | null;
  tipo_aparato: string;
  xp_otorgada: number;
  fecha_entrega?: string;
};

export type RegistroReciclajeUpdate = Partial<RegistroReciclajeInsert>;

// ---------------------------------------------------------------------------
// public.material_educativo
// ---------------------------------------------------------------------------

export type MaterialEducativo = {
  id: string; // uuid
  titulo: string;
  contenido: string;
  categoria: string | null;
  url_imagen: string | null;
  fecha_publicacion: string; // timestamptz (ISO 8601)
};

export type MaterialEducativoInsert = {
  id?: string;
  titulo: string;
  contenido: string;
  categoria?: string | null;
  url_imagen?: string | null;
  fecha_publicacion?: string;
};

export type MaterialEducativoUpdate = Partial<MaterialEducativoInsert>;

// ---------------------------------------------------------------------------
// Database (genérico para createClient<Database>)
// ---------------------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      spatial_ref_sys: {
        Row: SpatialRefSys;
        Insert: SpatialRefSys;
        Update: Partial<SpatialRefSys>;
        Relationships: [];
      };
      usuarios: {
        Row: Usuario;
        Insert: UsuarioInsert;
        Update: UsuarioUpdate;
        Relationships: [];
      };
      centros_acopio: {
        Row: CentroAcopio;
        Insert: CentroAcopioInsert;
        Update: CentroAcopioUpdate;
        Relationships: [];
      };
      registros_reciclaje: {
        Row: RegistroReciclaje;
        Insert: RegistroReciclajeInsert;
        Update: RegistroReciclajeUpdate;
        Relationships: [
          {
            foreignKeyName: 'registros_reciclaje_id_usuario_fkey';
            columns: ['id_usuario'];
            isOneToOne: false;
            referencedRelation: 'usuarios';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'registros_reciclaje_id_centro_fkey';
            columns: ['id_centro'];
            isOneToOne: false;
            referencedRelation: 'centros_acopio';
            referencedColumns: ['id'];
          },
        ];
      };
      material_educativo: {
        Row: MaterialEducativo;
        Insert: MaterialEducativoInsert;
        Update: MaterialEducativoUpdate;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

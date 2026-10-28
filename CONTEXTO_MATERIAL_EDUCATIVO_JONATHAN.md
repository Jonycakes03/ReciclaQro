# Contexto para Jonathan: Implementación de Material Educativo en Supabase

**Fecha:** 2026-10-27  
**Rama:** `JSuarez`  
**Objetivo:** Conectar el contenido estático de educación con el modelo de datos de Supabase

---

## Estado Actual

### Contenido Estático Implementado
El contenido educativo actualmente vive en código estático en:

**Archivos frontend:**
- `src/app/educacion/page.tsx` - Hub de artículos con tarjetas
- `src/app/educacion/[id]/page.tsx` - Página individual de cada artículo

**Datos estáticos:**
```typescript
const ARTICULOS = [
  {
    id: 'celular-basura',
    nivel: 'BÁSICO',
    tipo: 'ARTÍCULO',
    titulo: '¿Por qué tirar un celular a la basura es peligroso?',
    descripcion: 'Metales pesados como plomo y mercurio pueden contaminar el suelo y el agua.',
    tiempo: '4 min de lectura',
  },
  // ... 4 artículos más
];
```

**Contenido detallado (en `[id]/page.tsx`):**
```typescript
const CONTENIDO_ARTICULOS: Record<string, { titulo: string; nivel: string; tipo: string; contenido: JSX.Element }> = {
  'celular-basura': {
    titulo: '¿Por qué tirar un celular a la basura es peligroso?',
    nivel: 'BÁSICO',
    tipo: 'ARTÍCULO',
    contenido: ( <div>...</div> ), // JSX con contenido completo
  },
  // ... 4 artículos más
};
```

---

## Modelo de Datos en Supabase

### Tabla: `material_educativo`

**Estructura actual (definida en `src/types/database.ts`):**

```typescript
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
```

**Columnas:**
- `id` (uuid) - Identificador único
- `titulo` (text) - Título del material
- `contenido` (text) - Contenido del material (puede ser HTML o Markdown)
- `categoria` (text, nullable) - Categoría (ej: 'BÁSICO', 'AVANZADO', 'ARTÍCULO', 'INFOGRAFÍA', 'QUIZ', 'GUÍA DOCENTE')
- `url_imagen` (text, nullable) - URL de imagen asociada
- `fecha_publicacion` (timestamptz) - Fecha de publicación

---

## API Existente

### Endpoint: `GET /api/educacion`

**Archivo:** `src/app/api/educacion/route.ts`

Este endpoint ya existe y debe devolver el listado de materiales educativos desde Supabase.

**Esperado:**
```typescript
// Response
[
  {
    id: string;
    titulo: string;
    contenido: string;
    categoria: string | null;
    url_imagen: string | null;
    fecha_publicacion: string;
  }
]
```

---

## Lo que Jonathan Necesita Implementar

### 1. Crear tabla `material_educativo` en Supabase

**SQL para crear la tabla:**

```sql
CREATE TABLE public.material_educativo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  categoria TEXT,
  url_imagen TEXT,
  fecha_publicacion TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por categoría
CREATE INDEX idx_material_educativo_categoria ON public.material_educativo(categoria);

-- Índice para búsquedas por fecha
CREATE INDEX idx_material_educativo_fecha ON public.material_educativo(fecha_publicacion DESC);
```

### 2. Insertar datos iniciales

**Contenido actual (5 artículos):**

Los datos deben migrarse del código estático a Supabase. Para cada artículo:

**Artículo 1: celular-basura**
```sql
INSERT INTO public.material_educativo (titulo, contenido, categoria, url_imagen)
VALUES (
  '¿Por qué tirar un celular a la basura es peligroso?',
  '<div>
    <p>Los celulares y dispositivos electrónicos contienen metales pesados...</p>
    <!-- Contenido HTML completo del artículo -->
  </div>',
  'BÁSICO|ARTÍCULO',
  NULL
);
```

**Nota sobre formato de contenido:**
- El contenido actual está en JSX/React
- Para Supabase, debe convertirse a HTML estático o Markdown
- Recomendación: usar HTML estático con clases de Tailwind o Markdown renderizado en frontend

**Opción A (HTML estático):**
```sql
contenido TEXT: '<h2>Metales peligrosos en tu celular</h2><p>La mayoría de los dispositivos...</p>'
```

**Opción B (Markdown):**
```sql
contenido TEXT: '## Metales peligrosos en tu celular\n\nLa mayoría de los dispositivos...'
```

### 3. Política RLS para `material_educativo`

**Para lectura pública (todos pueden ver):**

```sql
-- Habilitar RLS
ALTER TABLE public.material_educativo ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer
CREATE POLICY "material_educativo_select_public"
ON public.material_educativo
FOR SELECT
TO public
USING (true);

-- Política: Solo usuarios autenticados pueden insertar (si aplica)
CREATE POLICY "material_educativo_insert_authenticated"
ON public.material_educativo
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden actualizar (si aplica)
CREATE POLICY "material_educativo_update_authenticated"
ON public.material_educativo
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
```

### 4. Actualizar endpoint `GET /api/educacion`

**Archivo:** `src/app/api/educacion/route.ts`

**Implementación esperada:**

```typescript
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('material_educativo')
    .select('*')
    .order('fecha_publicacion', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
```

**Notas importantes:**
- El contenido debe incluir campos adicionales que el frontend espera:
  - `nivel` (BÁSICO/AVANZADO) - puede derivarse de `categoria`
  - `tipo` (ARTÍCULO/INFOGRAFÍA/QUIZ/GUÍA DOCENTE) - puede derivarse de `categoria`
  - `tiempo` (ej: "4 min de lectura") - puede agregarse como columna adicional o parsearse de contenido

**Opción 1: Usar `categoria` con formato compuesto:**
```sql
categoria: 'BÁSICO|ARTÍCULO'
```

**Opción 2: Agregar columnas separadas:**
```sql
ALTER TABLE public.material_educativo
ADD COLUMN nivel TEXT,
ADD COLUMN tipo TEXT,
ADD COLUMN tiempo TEXT;
```

### 5. Agregar endpoint `GET /api/educacion/[id]`

**Archivo:** `src/app/api/educacion/[id]/route.ts` (nuevo)

**Implementación esperada:**

```typescript
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('material_educativo')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 404 });
  }

  return Response.json(data);
}
```

---

## Cambios en Frontend (Después de Implementación de Backend)

### Opción A: Mantener contenido estático (actual)

Si el contenido estático en código funciona bien, NO es necesario cambiar el frontend.

**Ventajas:**
- No requiere cambios en frontend
- Contenido versionado en git
- Fácil de editar con VS Code

**Desventajas:**
- No dinámico desde Supabase
- Requiere deploy para cambios de contenido

### Opción B: Conectar a API dinámica

Si Jonathan implementa la API dinámica, el frontend debe actualizarse para:

**En `src/app/educacion/page.tsx`:**
```typescript
'use client';

import { useEffect, useState } from 'react';

export default function EducacionPage() {
  const [articulos, setArticulos] = useState([]);

  useEffect(() => {
    fetch('/api/educacion')
      .then(res => res.json())
      .then(data => setArticulos(data));
  }, []);

  // Renderizar usando datos de API en lugar de ARTICULOS estáticos
}
```

**En `src/app/educacion/[id]/page.tsx`:**
```typescript
export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const res = await fetch(`/api/educacion/${id}`);
  const articulo = await res.json();

  // Renderizar usando articulo.contenido (HTML o Markdown)
}
```

---

## Formato de Contenido Recomendado

### Opción 1: HTML con Tailwind (más fácil de migrar desde JSX)

**Ventajas:**
- Migración directa desde JSX actual
- Renderizado directo en frontend (usando `dangerouslySetInnerHTML`)

**Desventajas:**
- No es el más limpio para editar en Supabase Dashboard
- XSS potential (si hay edición pública)

**Implementación frontend:**
```typescript
<div dangerouslySetInnerHTML={{ __html: articulo.contenido }} />
```

### Opción 2: Markdown (recomendado para edición en Supabase)

**Ventajas:**
- Más limpio y legible
- Seguro (no XSS)
- Fácil de editar en Supabase Dashboard

**Desventajas:**
- Requiere conversión desde JSX actual
- Requiere parser (ej: `react-markdown`)

**Dependencia requerida:**
```bash
npm install react-markdown
```

**Implementación frontend:**
```typescript
import ReactMarkdown from 'react-markdown';

<ReactMarkdown>{articulo.contenido}</ReactMarkdown>
```

---

## Resumen de Tareas para Jonathan

### Prioridad Alta (bloqueante para contenido dinámico)

1. **Crear tabla `material_educativo`** en Supabase
2. **Definir formato de contenido** (HTML vs Markdown)
3. **Insertar datos iniciales** (migrar 5 artículos actuales)
4. **Aplicar políticas RLS** (lectura pública, escritura autenticada)
5. **Actualizar endpoint `GET /api/educacion`** para devolver datos desde Supabase

### Prioridad Media (mejoras)

6. **Agregar endpoint `GET /api/educacion/[id]`** para artículo individual
7. **Decidir columnas adicionales** (nivel, tipo, tiempo) vs parser desde categoria
8. **Agregar índices** si se planean búsquedas frecuentes

### Prioridad Baja (opcional)

9. **Actualizar frontend** para usar API dinámica (si se prefiere contenido dinámico)
10. **Agregar imágenes** a los artículos (columna `url_imagen`)

---

## Datos de Migración (Referencia)

### Artículos Actuales a Migrar

| ID (slug) | Título | Nivel | Tipo | Tiempo |
|-----------|--------|-------|------|--------|
| celular-basura | ¿Por qué tirar un celular a la basura es peligroso? | BÁSICO | ARTÍCULO | 4 min de lectura |
| tipos-centros-acopio | Qué acepta cada tipo de centro de acopio | BÁSICO | INFOGRAFÍA | Vista rápida |
| economia-circular | De la chatarra a la economía circular | AVANZADO | ARTÍCULO | 6 min de lectura |
| raee-aula | RAEE en el aula: actividades para escuelas | AVANZADO | GUÍA DOCENTE | 8 min de lectura |
| clasifica-residuos | Identifica el residuo correcto | BÁSICO | QUIZ | 3 min |

### Slug Strategy

Los IDs actuales son slugs en kebab-case:
- `celular-basura`
- `tipos-centros-acopio`
- `economia-circular`
- `raee-aula`
- `clasifica-residuos`

**Opción 1:** Mantener slugs como IDs (requiere columna `slug`)
```sql
ALTER TABLE public.material_educativo ADD COLUMN slug TEXT UNIQUE;
```

**Opción 2:** Usar UUIDs y agregar mapeo en frontend
- El frontend busca por slug en una columna `slug`
- O el frontend usa UUIDs directamente (requiere cambios en rutas)

---

## Preguntas para Jonathan

1. **¿Prefieres contenido en HTML o Markdown?**
   - HTML: migración directa desde JSX, renderizado inmediato
   - Markdown: más limpio, requiere parser

2. **¿Cómo manejar nivel/tipo/tiempo?**
   - Columnas separadas en tabla
   - Parsear desde `categoria` (ej: "BÁSICO|ARTÍCULO|4 min")

3. **¿Slug o UUID?**
   - Slug: URLs amigables (`/educacion/celular-basura`)
   - UUID: URLs no amigables (`/educacion/123e4567-e89b-12d3-a456-426614174000`)

4. **¿El frontend debe ser dinámico?**
   - Sí: conectar a API de Supabase
   - No: mantener contenido estático en código (solo backend para referencia)

---

## Referencias Técnicas

**Archivos relevantes:**
- `src/types/database.ts` - Definición de tipos de Supabase
- `src/app/api/educacion/route.ts` - Endpoint existente (no implementado aún)
- `src/app/educacion/page.tsx` - Hub de artículos (frontend)
- `src/app/educacion/[id]/page.tsx` - Página individual (frontend)

**Documentación Supabase:**
- [PostgreSQL Guide](https://supabase.com/docs/guides/database)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

**Librerías útiles:**
- `react-markdown` - Para renderizar Markdown en React
- `sanitize-html` - Para sanitizar HTML si se usa HTML estático

---

## Nota Importante

La implementación actual del contenido educativo en el frontend está **completamente funcional**. No es un bloqueante para el proyecto. La implementación de Supabase es una mejora para:
- Hacer el contenido dinámico
- Permitir edición sin deploy
- Facilitar colaboración entre usuarios

El contenido actual puede migrarse gradualmente. Si el backend no está listo, el frontend seguirá funcionando con el contenido estático.

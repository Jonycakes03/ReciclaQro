# ReciclaQro

Aplicación web para encontrar centros de acopio de reciclaje en Querétaro, con módulos educativos y gamificación.

## Stack Tecnológico

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Supabase** - Backend as a service (base de datos, autenticación)
- **Mapbox GL** - Mapas interactivos

## Estructura del Proyecto

```
reciclaqro-app/
├── public/                 # Archivos estáticos (imágenes, logos, íconos)
├── src/
│   ├── app/                # Rutas y páginas principales (Next.js App Router)
│   │   ├── (auth)/         # Rutas agrupadas para autenticación
│   │   │   └── login/
│   │   │       └── page.tsx      # Pantalla de Magic Link
│   │   ├── educacion/      # Módulo Educativo
│   │   │   ├── [id]/             # Artículo dinámico (ej. educacion/baterias)
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx          # Hub principal de artículos
│   │   ├── perfil/         # Módulo de Gamificación
│   │   │   └── page.tsx          # Dashboard del usuario (Niveles, XP)
│   │   ├── api/            # Endpoints del backend (Rutas de API)
│   │   │   └── webhooks/         # Para conexiones externas si se requieren
│   │   ├── layout.tsx      # Estructura base (Navbar, Footer, Providers)
│   │   └── page.tsx        # Landing Page (Mapa interactivo de acopios)
│   │
│   ├── components/         # Componentes visuales reutilizables (Capa de Presentación)
│   │   ├── ui/             # Botones, inputs, modales (ej. Tailwind/Shadcn)
│   │   ├── mapa/           # Componentes específicos del Mapbox (Pines, Filtros, BottomSheet)
│   │   ├── perfil/         # Barras de progreso, tarjetas de historial
│   │   └── educacion/      # Tarjetas de artículos, grillas
│   │
│   ├── lib/                # Configuración de librerías externas
│   │   └── supabase.ts     # Inicialización del cliente de Supabase
│   │
│   ├── services/           # Lógica de negocio y consultas a la base de datos (Data Layer)
│   │   ├── centros.ts      # Consultas geoespaciales (PostGIS) a Supabase
│   │   ├── usuarios.ts     # Gestión de perfiles y cálculo de XP
│   │   └── educacion.ts    # Extracción del contenido didáctico
│   │
│   ├── types/              # Definiciones de TypeScript (Interfaces)
│   │   └── index.ts        # Tipados de Usuario, CentroAcopio, Articulo
│   │
│   └── utils/              # Funciones auxiliares genéricas
│       └── formatters.ts   # Formateo de fechas, cálculo matemático de niveles
│
├── .env.local              # Variables de entorno (API Keys de Mapbox y Supabase)
├── tailwind.config.ts      # Configuración de estilos y colores del proyecto
├── package.json            # Dependencias del proyecto
└── tsconfig.json           # Configuración de TypeScript
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env.local
```
Edita `.env.local` con tus credenciales de Supabase y Mapbox.

3. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

4. Abrir [http://localhost:3000](http://localhost:3167) en tu navegador.

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Configuración de Base de Datos

La aplicación requiere las siguientes tablas en Supabase:

- `usuarios` - Perfiles de usuarios con XP y niveles
- `centros_acopio` - Ubicaciones de centros de reciclaje con datos geoespaciales
- `articulos` - Contenido educativo sobre reciclaje
- `registros_reciclaje` - Historial de reciclaje de usuarios
- `logros` - Sistema de gamificación

También se requieren funciones de PostGIS para consultas geoespaciales.

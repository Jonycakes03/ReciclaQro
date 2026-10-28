# Instrucciones de Configuración en Supabase Dashboard

Para completar el rediseño de autenticación, sigue estos pasos en el Supabase Dashboard:

## 1. Verificar proveedor Email

1. Ve a **Authentication → Providers**
2. Confirma que el proveedor **Email** está habilitado
3. Asegúrate de que admite **Email Password** (no solo Magic Link)

## 2. Configurar URLs de Redirect

1. Ve a **Authentication → URL Configuration**
2. En **Site URL**, añade:
   - Desarrollo: `http://localhost:3000`
   - Producción: tu URL de producción (cuando exista)
3. En **Redirect URLs**, añade:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/crear-contrasena`
   - Tu URL de producción con `/auth/callback`
   - Tu URL de producción con `/crear-contrasena`

## 3. Seguridad de Contraseñas

1. Ve a **Authentication → Providers → Email**
2. Activa **Password Protection** si está disponible
3. Configura **Minimum Password Length** a 8 caracteres
4. Activa **Password Hashing** y **Breach Detection** si están disponibles

## 4. Aplicar Políticas RLS (Bloqueante)

El documento de traspaso indica que las políticas RLS en `usuarios` están incompletas. Ejecuta esto en el **SQL Editor**:

```sql
-- Habilitar RLS en usuarios
alter table public.usuarios enable row level security;

-- Política SELECT: solo el propio usuario puede leer su fila
create policy "usuarios_select_propio" on public.usuarios
  for select to authenticated using (auth.uid() = id);

-- Política INSERT: solo el propio usuario puede crear su fila
create policy "usuarios_insert_propio" on public.usuarios
  for insert to authenticated with check (auth.uid() = id);

-- Política UPDATE: solo el propio usuario puede actualizar su fila
create policy "usuarios_update_propio" on public.usuarios
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Habilitar RLS en registros_reciclaje
alter table public.registros_reciclaje enable row level security;

-- Política SELECT: solo el propio usuario puede leer sus registros
create policy "registros_select_propio" on public.registros_reciclaje
  for select to authenticated using (auth.uid() = id_usuario);

-- Política INSERT: solo el propio usuario puede crear sus registros
create policy "registros_insert_propio" on public.registros_reciclaje
  for insert to authenticated with check (auth.uid() = id_usuario);
```

> **Nota de seguridad:** Con `update` abierto al propio usuario, un cliente podría editar su `experiencia_xp` directamente. Para producción, considera:
> - Restringir columnas en la política UPDATE (solo permitir `nombre`)
> - O quitar el `update` y sumar XP vía RPC `security definer`

## 5. Ejecutar Seed SQL (Opcional)

Si aún no has ejecutado el seed SQL con datos demo:

1. Ve al **SQL Editor**
2. Abre el archivo `supabase/seed.sql` del repo
3. Copia y ejecuta el contenido
4. Esto creará políticas RLS públicas y datos demo de centros

## 6. Verificar Configuración

Después de configurar todo:

1. Reinicia el dev server: `npm run dev`
2. Prueba el flujo de registro:
   - Ve a `/registro`
   - Ingresa tu correo
   - Recibe el Magic Link
   - Crea tu contraseña
   - Deberías ser redirigido a `/perfil`
3. Prueba el login:
   - Ve a `/login`
   - Ingresa correo + contraseña
   - Deberías acceder a `/perfil`
4. Prueba la recuperación:
   - Ve a `/login`
   - Haz clic en "¿Olvidaste tu contraseña?"
   - Ingresa tu correo
   - Recibe el Magic Link de recuperación
   - Establece nueva contraseña

## Troubleshooting

### Error: "new row violates row-level security policy"
- Significa que las políticas INSERT no están aplicadas
- Ejecuta el SQL del paso 4

### Error: "Auth callback failed"
- Verifica que las URLs de redirect estén configuradas correctamente
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` estén en `.env.local`

### Magic Link no llega
- Verifica que el proveedor Email esté habilitado
- Revisa la carpeta de spam
- En Supabase Dashboard, verifica **Authentication → Email Templates**

### No puedo crear contraseña
- Verifica que el middleware no esté creando un loop
- Verifica que `password_set` se esté estableciendo correctamente en el callback

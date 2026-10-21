# Plan de Pruebas - Rediseño de Autenticación

## Pre-requisitos

- [ ] Configurar variables de entorno en `.env.local`
- [ ] Ejecutar políticas RLS del archivo `INSTRUCCIONES_SUPABASE.md`
- [ ] Configurar URLs de redirect en Supabase Dashboard
- [ ] Iniciar dev server: `npm run dev`

## Flujo 1: Registro Nuevo (Magic Link → Contraseña)

### Pasos:
1. Navegar a `http://localhost:3000/registro`
2. Ingresar un correo nuevo (que no exista en Supabase)
3. Hacer clic en "Enviar Magic Link"
4. Ver mensaje de éxito "¡Revisa tu bandeja de entrada!"
5. Abrir el correo y hacer clic en el Magic Link
6. Debería redirigir a `/crear-contrasena`
7. Ingresar contraseña (mínimo 8 caracteres)
8. Confirmar contraseña
9. Hacer clic en "Establecer Contraseña"
10. Ver mensaje de éxito "¡Contraseña establecida!"
11. Debería redirigir automáticamente a `/perfil`
12. Verificar que el perfil muestra datos (nivel 1, XP 0)

### Resultados esperados:
- ✅ Magic Link llega al correo
- ✅ Callback redirige a `/crear-contrasena` (no a `/perfil`)
- ✅ Contraseña se establece correctamente
- ✅ `password_set` se marca como `true` en user metadata
- ✅ Fila de `usuarios` se crea en la base de datos
- ✅ Perfil muestra datos reales del backend

## Flujo 2: Login Existente (Correo + Contraseña)

### Pasos:
1. Cerrar sesión si estás logueado
2. Navegar a `http://localhost:3000/login`
3. Ingresar correo de usuario registrado
4. Ingresar contraseña correcta
5. Hacer clic en "Iniciar Sesión"
6. Debería redirigir a `/perfil`
7. Verificar que muestra datos del usuario

### Resultados esperados:
- ✅ Login exitoso con correo + contraseña
- ✅ Redirección a `/perfil`
- ✅ Perfil muestra datos correctos

### Caso de error:
1. Ingresar contraseña incorrecta
2. Debería mostrar error "Error al iniciar sesión. Verifica tus credenciales."
- ✅ Mensaje de error claro
- ✅ No se redirige a `/perfil`

## Flujo 3: Recuperación de Contraseña

### Pasos:
1. Estando logueado, cerrar sesión
2. Navegar a `http://localhost:3000/login`
3. Ingresar correo de usuario registrado
4. Hacer clic en "¿Olvidaste tu contraseña?"
5. Ver mensaje "¡Correo enviado!"
6. Abrir el correo y hacer clic en el Magic Link
7. Debería redirigir a `/crear-contrasena`
8. Ingresar nueva contraseña
9. Confirmar nueva contraseña
10. Hacer clic en "Establecer Contraseña"
11. Debería redirigir a `/perfil`
12. Probar login con la nueva contraseña

### Resultados esperados:
- ✅ Magic Link de recuperación llega al correo
- ✅ Callback redirige a `/crear-contrasena`
- ✅ Nueva contraseña se establece
- ✅ Login funciona con nueva contraseña

## Flujo 4: Middleware Redirección

### Pasos:
1. Usar Supabase Dashboard para crear un usuario manualmente
2. NO establecer `password_set: true` en metadata
3. Intentar navegar a cualquier ruta protegida (ej. `/perfil`)
4. Debería redirigir automáticamente a `/crear-contrasena`

### Resultados esperados:
- ✅ Middleware detecta `password_set !== true`
- ✅ Redirección a `/crear-contrasena`
- ✅ No se permite acceso a otras rutas hasta establecer contraseña

## Flujo 5: Usuario Ya Logueado

### Pasos:
1. Estando logueado, navegar a `/login`
2. Debería mostrar mensaje "¡Ya has iniciado sesión como [email]!"
3. Botón "Ir a Mi Progreso →"

### Resultados esperados:
- ✅ Detecta usuario logueado
- ✅ Muestra mensaje claro
- ✅ Botón redirige a `/perfil`

## Flujo 6: Registro con Correo Existente

### Pasos:
1. Cerrar sesión
2. Navegar a `/registro`
3. Ingresar correo de usuario ya registrado
4. Hacer clic en "Enviar Magic Link"
5. Magic Link debería funcionar como login (comportamiento de Supabase)
6. Al hacer clic, redirigir a `/crear-contrasena` si no tiene contraseña

### Resultados esperados:
- ✅ Magic Link funciona con correo existente
- ✅ Comportamiento consistente con flujo de registro

## Pruebas de Edge Cases

### Contraseña muy corta:
1. En `/crear-contrasena`, ingresar contraseña de 5 caracteres
2. Debería mostrar error "La contraseña debe tener al menos 8 caracteres"
- ✅ Validación de longitud funciona

### Contraseñas no coinciden:
1. Ingresar contraseñas diferentes
2. Debería mostrar error "Las contraseñas no coinciden"
- ✅ Validación de coincidencia funciona

### Sin sesión en `/crear-contrasena`:
1. Cerrar sesión
2. Navegar directamente a `/crear-contrasena`
3. Debería redirigir a `/login`
- ✅ Protección de ruta funciona

### Campos vacíos:
1. Intentar enviar formulario sin email en `/login`
2. Intentar enviar formulario sin contraseña en `/login`
3. Debería mostrar validación HTML5
- ✅ Validación de campos requeridos funciona

## Pruebas de API

### POST /api/perfil (crear usuario):
1. Usar curl o Postman con access_token válido
2. `POST /api/perfil` con body `{}`
3. Debería crear fila en `usuarios` si no existe
4. Debería devolver usuario con nivel 1, XP 0

### GET /api/perfil (obtener perfil):
1. `GET /api/perfil` con access_token válido
2. Debería devolver usuario + historial vacío
3. Sin access_token debería devolver 401

## Checklist Final

Antes de considerar la implementación completa:

- [ ] Todos los flujos de registro funcionan
- [ ] Login con contraseña funciona
- [ ] Recuperación de contraseña funciona
- [ ] Middleware redirige correctamente
- [ ] Políticas RLS no bloquean operaciones
- [ ] Build pasa sin errores
- [ ] No hay errores en consola del navegador
- [ ] UX es clara (mensajes de error/sucesos visibles)
- [ ] URLs de redirect están configuradas en Supabase
- [ ] Seed SQL ejecutado (opcional, para datos demo)

## Bugs Conocidos / Limitaciones

- **Warning de build:** `ReferenceError: location is not defined` en `/crear-contrasena`
  - Causa: Pre-renderización estática intenta acceder a `window.location`
  - Solución: Marcado como `dynamic = 'force-dynamic'`
  - Impacto: Solo warning visual, no afecta funcionalidad

- **XP enviada por cliente:** El endpoint `/api/reciclaje` acepta `xp_otorgada` del cliente
  - Riesgo: Cliente podría manipular su XP
  - Solución futura: Calcular XP en servidor según `tipo_aparato`

/**
 * @deprecated Usa `@/lib/supabase/server`. Se mantiene como re-export por compatibilidad
 * (la versión anterior llamaba a `cookies()` de forma síncrona, incompatible con Next.js 15).
 */
export { createSupabaseServerClient as createClient } from './supabase/server';

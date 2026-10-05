import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Identidad */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                ♻️
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Recicla<span className="text-emerald-400">Qro</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Plataforma ciudadana autónoma para el fomento, mapeo y gestión del reciclaje de
              Residuos de Aparatos Eléctricos y Electrónicos (RAEE) en Querétaro. Promovemos la economía circular y la reducción de huella tóxica.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-full w-fit">
              <span>📍 Cobertura: Querétaro, Corregidora, El Marqués y San Juan del Río</span>
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Módulos
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Mapa Interactivo
                </Link>
              </li>
              <li>
                <Link href="/educacion" className="hover:text-emerald-400 transition-colors">
                  Hub Educativo y Guías
                </Link>
              </li>
              <li>
                <Link href="/perfil" className="hover:text-emerald-400 transition-colors">
                  Gamificación & Registro XP
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Acceso Voluntario
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información RAEE */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              ¿Qué es RAEE?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Aparatos que requieren corriente eléctrica o campos electromagnéticos: celulares, pilas, pantallas, computadoras y electrodomésticos.
            </p>
            <span className="inline-block text-xs font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-1 rounded">
              ⚠️ ¡Nunca los tires a la basura común!
            </span>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ReciclaQro - Proyecto de Impacto Ambiental & Ciudadano.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300">Open Data Querétaro</span>
            <span>•</span>
            <span className="hover:text-slate-300">Desarrollado con Next.js + Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

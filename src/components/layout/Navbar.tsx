'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, isLoading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authPanelOpen, setAuthPanelOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Mapa', href: '/' },
    { name: 'Aprende', href: '/educacion' },
    { name: 'Mi progreso', href: '/perfil' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAvatarInitials = () => {
    if (profile?.nombre) return profile.nombre.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              RQ
            </div>
            <span className="font-bold text-base">ReciclaQro</span>
          </Link>

          {/* Navigation Tabs */}
          <nav className="flex gap-1 flex-1 overflow-x-auto">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-2.5">
            {isLoading ? (
              <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center gap-2.5 relative" ref={dropdownRef}>
                <span className="font-semibold text-sm hidden sm:block">
                  {profile?.nombre || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-gray-100 border-2 border-emerald-600 flex items-center justify-center font-bold text-emerald-600 hover:scale-105 transition-transform cursor-pointer"
                >
                  {getAvatarInitials()}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-[120%] bg-white border border-gray-200 rounded-xl w-[220px] shadow-lg flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        // TODO: Open avatar modal
                      }}
                      className="px-4 py-3.5 text-sm font-semibold text-left hover:bg-gray-50 hover:text-emerald-600 transition-colors border-b border-gray-200"
                    >
                      🎨 Cambiar avatar
                    </button>
                    <button
                      onClick={() => {
                        signOut();
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-3.5 text-sm font-semibold text-left hover:bg-gray-50 hover:text-red-600 transition-colors"
                    >
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthPanelOpen(!authPanelOpen)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Ingresar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Auth Panel (Dropdown) */}
        {!user && authPanelOpen && (
          <div className="pb-4">
            <div className="max-w-[360px] bg-white border border-gray-200 rounded-xl p-4.5 shadow-sm">
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Te enviaremos un Magic Link para acceder sin contraseña
              </p>
              <Link
                href="/login"
                onClick={() => setAuthPanelOpen(false)}
                className="w-full bg-emerald-600 text-white border-none px-4 py-2.5 rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 shadow-sm"
              >
                <span>Enviar Magic Link</span>
              </Link>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                Al ingresar aceptas participar en el programa ciudadano voluntario de ReciclaQro.
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

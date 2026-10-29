/**
 * Sistema de Gamificación, Niveles, Experiencia (XP) y Geocercas para ReciclaQro.
 */

import { Coordenadas, distanciaKm } from './geo';
import type { CentroAcopioMapa } from '@/types/database';

export interface AparatoReciclaje {
  id: string;
  nombre: string;
  categoria: 'menor' | 'medio' | 'mayor' | 'pesado';
  xp: number;
  icono: string;
  descripcion: string;
  impactoAmbiental: string;
}

export const APARATOS_RECICLAJE: AparatoReciclaje[] = [
  {
    id: 'audifonos-cables',
    nombre: 'Audífonos, Cables o Cargador',
    categoria: 'menor',
    xp: 25,
    icono: '🎧',
    descripcion: 'Accesorios periféricos, cables USB y conectores en desuso.',
    impactoAmbiental: 'Evita la quema de plásticos PVC y recupera hilos de cobre puro.',
  },
  {
    id: 'reloj-inteligente',
    nombre: 'Reloj Inteligente / Smartwatch',
    categoria: 'menor',
    xp: 40,
    icono: '⌚',
    descripcion: 'Smartwatches, bandas deportivas y pequeños wearables.',
    impactoAmbiental: 'Recupera microprocesadores y baterías compactas de litio.',
  },
  {
    id: 'celular-smartphone',
    nombre: 'Celular o Smartphone',
    categoria: 'medio',
    xp: 75,
    icono: '📱',
    descripcion: 'Teléfonos móviles de cualquier año, pantalla rota o en desuso.',
    impactoAmbiental: 'Salva hasta 600,000 litros de agua y recupera oro, plata y paladio.',
  },
  {
    id: 'baterias-pilas',
    nombre: 'Baterías o Paquete de Pilas',
    categoria: 'medio',
    xp: 80,
    icono: '🔋',
    descripcion: 'Baterías de laptop/celular o lote de pilas alcalinas/recargables.',
    impactoAmbiental: 'Impide la fuga de mercurio, níquel y cadmio a mantos freáticos.',
  },
  {
    id: 'tableta-ipad',
    nombre: 'Tableta o iPad',
    categoria: 'medio',
    xp: 100,
    icono: '📟',
    descripcion: 'Tabletas electrónicas y lectores de libros digitales (Kindle, etc.).',
    impactoAmbiental: 'Desvía paneles táctiles y baterías de gran capacidad de vertederos.',
  },
  {
    id: 'pequeno-electrodomestico',
    nombre: 'Pequeño Electrodoméstico',
    categoria: 'medio',
    xp: 120,
    icono: '☕',
    descripcion: 'Licuadoras, cafeteras, tostadoras, batidoras, planchas o secadoras.',
    impactoAmbiental: 'Recicla motores eléctricos de cobre, bobinados y carcasas metálicas.',
  },
  {
    id: 'laptop-portatil',
    nombre: 'Laptop / Computadora Portátil',
    categoria: 'mayor',
    xp: 160,
    icono: '💻',
    descripcion: 'Laptops, notebooks y cargadores de alta potencia.',
    impactoAmbiental: 'Reinserta tarjetas madre de alta densidad y aleaciones de aluminio.',
  },
  {
    id: 'computadora-cpu',
    nombre: 'Computadora de Escritorio / Torre CPU',
    categoria: 'mayor',
    xp: 220,
    icono: '🖥️',
    descripcion: 'Gabinetes CPU, fuentes de poder, discos duros y servidores.',
    impactoAmbiental: 'Evita la dispersión de retardantes de llama bromados y plomo.',
  },
  {
    id: 'monitor-pantalla',
    nombre: 'Monitor, Pantalla o Televisión',
    categoria: 'mayor',
    xp: 250,
    icono: '📺',
    descripcion: 'Monitores LCD, LED, Smart TVs o antiguos cinescopios CRT.',
    impactoAmbiental: 'Neutraliza vidrios tratados con plomo y lámparas fluorescentes con fósforo.',
  },
  {
    id: 'gran-electrodomestico',
    nombre: 'Línea Blanca / Gran Electrodoméstico',
    categoria: 'pesado',
    xp: 350,
    icono: '🧺',
    descripcion: 'Lavadoras, secadoras, microondas grandes o refrigeradores.',
    impactoAmbiental: 'Recupera hasta 40 kg de acero reciclable y gestiona gases refrigerantes.',
  },
];

export interface NivelReciclaje {
  nivel: number;
  titulo: string;
  icono: string;
  xpMin: number;
  xpMax: number; // XP a alcanzar para subir al siguiente (o Infinity)
  colorBadge: string;
  descripcion: string;
}

export const NIVELES_RECICLAJE: NivelReciclaje[] = [
  {
    nivel: 1,
    titulo: 'Semilla Ecológica',
    icono: '🌱',
    xpMin: 0,
    xpMax: 150,
    colorBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    descripcion: 'Inicias tu compromiso ciudadano evitando que tus electrónicos terminen en vertederos.',
  },
  {
    nivel: 2,
    titulo: 'Reciclador Novato',
    icono: '🥉',
    xpMin: 150,
    xpMax: 400,
    colorBadge: 'bg-amber-100 text-amber-800 border-amber-300',
    descripcion: 'Has comenzado a desviar metales pesados y salvar miles de litros de agua queretana.',
  },
  {
    nivel: 3,
    titulo: 'Guardián Verde',
    icono: '🥈',
    xpMin: 400,
    xpMax: 900,
    colorBadge: 'bg-teal-100 text-teal-800 border-teal-300',
    descripcion: 'Compromiso constante con la entrega responsable en centros certificados de acopio.',
  },
  {
    nivel: 4,
    titulo: 'Protector del Semidesierto',
    icono: '🥇',
    xpMin: 900,
    xpMax: 1800,
    colorBadge: 'bg-blue-100 text-blue-800 border-blue-300',
    descripcion: 'Tu huella ecológica protege los mantos freáticos y la biodiversidad regional.',
  },
  {
    nivel: 5,
    titulo: 'Héroe Ambiental Qro',
    icono: '💎',
    xpMin: 1800,
    xpMax: 3500,
    colorBadge: 'bg-purple-100 text-purple-800 border-purple-300',
    descripcion: 'Referente de economía circular y minería urbana sustentable en el estado.',
  },
  {
    nivel: 6,
    titulo: 'Embajador Circular',
    icono: '👑',
    xpMin: 3500,
    xpMax: Infinity,
    colorBadge: 'bg-rose-100 text-rose-800 border-rose-300',
    descripcion: 'Máximo honor ecológico. Tu impacto ha inspirado a toda una comunidad.',
  },
];

export interface ProgresoUsuario {
  nivel: number;
  infoNivel: NivelReciclaje;
  siguienteNivel: NivelReciclaje | null;
  xpActual: number;
  xpNivelBase: number;
  xpParaSiguiente: number;
  xpFaltante: number;
  porcentaje: number;
}

/**
 * Calcula con precisión el nivel y porcentaje de progreso del usuario según su XP.
 */
export function calcularProgresoUsuario(xp: number): ProgresoUsuario {
  const xpSegura = Math.max(0, Math.floor(xp || 0));

  // Buscar el nivel correspondiente
  let nivelObj = NIVELES_RECICLAJE[0];
  let siguienteObj: NivelReciclaje | null = NIVELES_RECICLAJE[1];

  for (let i = 0; i < NIVELES_RECICLAJE.length; i++) {
    const n = NIVELES_RECICLAJE[i];
    if (xpSegura >= n.xpMin) {
      nivelObj = n;
      siguienteObj = NIVELES_RECICLAJE[i + 1] ?? null;
    }
  }

  if (!siguienteObj) {
    // Nivel máximo alcanzado
    return {
      nivel: nivelObj.nivel,
      infoNivel: nivelObj,
      siguienteNivel: null,
      xpActual: xpSegura,
      xpNivelBase: nivelObj.xpMin,
      xpParaSiguiente: nivelObj.xpMin,
      xpFaltante: 0,
      porcentaje: 100,
    };
  }

  const rangoNivel = siguienteObj.xpMin - nivelObj.xpMin;
  const progresoEnNivel = xpSegura - nivelObj.xpMin;
  const porcentaje = Math.min(100, Math.max(0, Math.round((progresoEnNivel / rangoNivel) * 100)));
  const xpFaltante = Math.max(0, siguienteObj.xpMin - xpSegura);

  return {
    nivel: nivelObj.nivel,
    infoNivel: nivelObj,
    siguienteNivel: siguienteObj,
    xpActual: xpSegura,
    xpNivelBase: nivelObj.xpMin,
    xpParaSiguiente: siguienteObj.xpMin,
    xpFaltante,
    porcentaje,
  };
}

/**
 * Radio geofence en metros para permitir el registro (500 metros para tolerar GPS interior).
 */
export const RADIO_GEOFENCE_METROS = 500;

export interface ValidacionGeocerca {
  permitido: boolean;
  centroMasCercano: CentroAcopioMapa | null;
  distanciaMetros: number | null;
  distanciaKm: number | null;
  mensaje: string;
}

/**
 * Valida si la ubicación del usuario se encuentra dentro del radio permitido de algún centro de acopio.
 */
export function validarGeocercaReciclaje(
  userCoords: Coordenadas | null,
  centros: CentroAcopioMapa[],
  radioMetros: number = RADIO_GEOFENCE_METROS
): ValidacionGeocerca {
  if (!userCoords) {
    return {
      permitido: false,
      centroMasCercano: null,
      distanciaMetros: null,
      distanciaKm: null,
      mensaje: 'No se ha detectado tu ubicación geográfica. Activa los permisos de ubicación GPS.',
    };
  }

  if (!centros || centros.length === 0) {
    return {
      permitido: false,
      centroMasCercano: null,
      distanciaMetros: null,
      distanciaKm: null,
      mensaje: 'No hay centros de acopio disponibles en este momento.',
    };
  }

  let centroCercano: CentroAcopioMapa | null = null;
  let menorDistKm = Infinity;

  for (const centro of centros) {
    if (typeof centro.lat !== 'number' || typeof centro.lng !== 'number') continue;
    const dKm = distanciaKm(userCoords, { lat: centro.lat, lng: centro.lng });
    if (dKm < menorDistKm) {
      menorDistKm = dKm;
      centroCercano = centro;
    }
  }

  if (!centroCercano || !Number.isFinite(menorDistKm)) {
    return {
      permitido: false,
      centroMasCercano: null,
      distanciaMetros: null,
      distanciaKm: null,
      mensaje: 'No fue posible calcular la distancia a los centros de acopio.',
    };
  }

  const distanciaMetros = Math.round(menorDistKm * 1000);
  const permitido = distanciaMetros <= radioMetros;

  const distanciaTexto =
    distanciaMetros < 1000 ? `${distanciaMetros} metros` : `${menorDistKm.toFixed(2)} km`;

  const mensaje = permitido
    ? `📍 ¡Estás en ${centroCercano.nombre}! (a ${distanciaTexto}). Presencia confirmada.`
    : `📍 Te encuentras a ${distanciaTexto} de ${centroCercano.nombre}. Debes estar a menos de ${radioMetros}m de un centro para registrar tu entrega.`;

  return {
    permitido,
    centroMasCercano: centroCercano,
    distanciaMetros,
    distanciaKm: menorDistKm,
    mensaje,
  };
}

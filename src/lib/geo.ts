/**
 * Utilidades geográficas (sin dependencias, válidas en servidor y navegador).
 */

export type Coordenadas = { lat: number; lng: number };

const esCoordValida = (lat: number, lng: number) =>
  Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

/**
 * Decodifica un Point en formato EWKB/WKB hexadecimal, que es como PostgREST devuelve
 * las columnas PostGIS `geography`/`geometry` (p. ej. "0101000020E6100000...").
 */
function parseWkbHexPoint(hex: string): Coordenadas | null {
  if (hex.length < 42 || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) return null;

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  const view = new DataView(bytes.buffer);
  const littleEndian = bytes[0] === 1;
  const type = view.getUint32(1, littleEndian);

  const HAS_SRID = 0x20000000;
  const baseType = type & 0xff; // 1 = Point
  if (baseType !== 1) return null;

  const offset = 5 + ((type & HAS_SRID) !== 0 ? 4 : 0);
  if (bytes.length < offset + 16) return null;

  const lng = view.getFloat64(offset, littleEndian); // X = longitud
  const lat = view.getFloat64(offset + 8, littleEndian); // Y = latitud

  return esCoordValida(lat, lng) ? { lat, lng } : null;
}

/**
 * Extrae { lat, lng } de la columna `ubicacion`, sea EWKB hexadecimal o GeoJSON Point.
 * Devuelve `null` si el valor no es un punto válido.
 */
export function parseUbicacion(value: unknown): Coordenadas | null {
  if (typeof value === 'string') return parseWkbHexPoint(value.trim());

  if (value && typeof value === 'object') {
    const geo = value as { type?: string; coordinates?: unknown };
    if (geo.type === 'Point' && Array.isArray(geo.coordinates)) {
      const [lng, lat] = geo.coordinates as number[];
      return esCoordValida(lat, lng) ? { lat, lng } : null;
    }
  }
  return null;
}

/** Distancia en km entre dos puntos (fórmula de Haversine). */
export function distanciaKm(a: Coordenadas, b: Coordenadas): number {
  const R = 6371;
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

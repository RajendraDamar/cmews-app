/**
 * Converts Longitude / Latitude to Web Mercator pixel coordinates at a given zoom level.
 * This is useful for calculating pixel offsets (`dx`, `dy`) between two coordinates 
 * for map-synchronized layout animations (like mitosis clustering).
 */
export function lngLatToPixels(lng: number, lat: number, zoom: number) {
  const scale = 256 * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * scale;
  
  // Bound latitude to prevent Infinity
  const boundedLat = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const sinLat = Math.sin((boundedLat * Math.PI) / 180);
  
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  
  return { x, y };
}

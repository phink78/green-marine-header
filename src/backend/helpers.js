/**
 * Shared helper functions for lead processing
 * Extracted for testability and reuse
 *
 * Note: Uses CommonJS exports for Jest compatibility
 * These functions are also duplicated in the .jsw files for Wix runtime
 */

/**
 * Convert trip bucket code to Dutch label
 * @param {string} b - Trip bucket code ('2to4', '4to8', '8plus')
 * @returns {string} Dutch label
 */
function bucketLabel(b) {
  if (b === '2to4') return '2–4 uur';
  if (b === '4to8') return '4–8 uur';
  if (b === '8plus') return '8+ uur';
  return '-';
}

/**
 * Convert water type code to Dutch label
 * @param {string} w - Water type ('inland', 'coastal', 'both')
 * @returns {string} Dutch label
 */
function waterLabel(w) {
  if (w === 'inland') return 'Binnenwater';
  if (w === 'coastal') return 'Kustwater';
  if (w === 'both') return 'Binnenwater + Kustwater';
  return '-';
}

/**
 * Convert value to number or null if not valid
 * @param {*} v - Value to convert
 * @returns {number|null}
 */
function toNumberOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * Format number with unit, or return '-' if not valid
 * @param {*} v - Value to format
 * @param {string} unit - Unit string (e.g., 'kW', 'kWh', 'km/h')
 * @returns {string}
 */
function fmtNum(v, unit) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '-';
  const txt = (unit === 'km/h') ? n.toFixed(1) : String(Math.round(n));
  return `${txt} ${unit}`;
}

/**
 * Safely stringify an object
 * @param {*} obj - Object to stringify
 * @returns {string}
 */
function safeString(obj) {
  try { return JSON.stringify(obj); } catch { return String(obj); }
}

/**
 * Map trip duration string to bucket code
 * @param {string} duration - Trip duration string (e.g., '2-4 hours')
 * @returns {string|null} Bucket code
 */
function mapTripDuration(duration) {
  if (!duration) return null;
  if (duration.includes('2') && duration.includes('4')) return '2to4';
  if (duration.includes('4') && duration.includes('8')) return '4to8';
  if (duration.includes('8') || duration.includes('+')) return '8plus';
  return null;
}

/**
 * Get minimum hours from trip duration string
 * @param {string} duration - Trip duration string
 * @returns {number|null}
 */
function getTripMin(duration) {
  if (!duration) return null;
  if (duration.includes('2')) return 2;
  if (duration.includes('4')) return 4;
  if (duration.includes('8')) return 8;
  return null;
}

/**
 * Get maximum hours from trip duration string
 * @param {string} duration - Trip duration string
 * @returns {number|null}
 */
function getTripMax(duration) {
  if (!duration) return null;
  if (duration.includes('4') && !duration.includes('8')) return 4;
  if (duration.includes('8') && !duration.includes('+')) return 8;
  return 12;
}

// CommonJS exports for Jest compatibility
module.exports = {
  bucketLabel,
  waterLabel,
  toNumberOrNull,
  fmtNum,
  safeString,
  mapTripDuration,
  getTripMin,
  getTripMax
};

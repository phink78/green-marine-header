/**
 * Tests for backend helper functions
 * These pure functions handle data transformation for leads
 */

const {
  bucketLabel,
  waterLabel,
  toNumberOrNull,
  fmtNum,
  safeString,
  mapTripDuration,
  getTripMin,
  getTripMax
} = require('../../src/backend/helpers.js');

describe('bucketLabel', () => {
  it('should return "2–4 uur" for "2to4"', () => {
    expect(bucketLabel('2to4')).toBe('2–4 uur');
  });

  it('should return "4–8 uur" for "4to8"', () => {
    expect(bucketLabel('4to8')).toBe('4–8 uur');
  });

  it('should return "8+ uur" for "8plus"', () => {
    expect(bucketLabel('8plus')).toBe('8+ uur');
  });

  it('should return "-" for unknown values', () => {
    expect(bucketLabel('unknown')).toBe('-');
    expect(bucketLabel(null)).toBe('-');
    expect(bucketLabel(undefined)).toBe('-');
    expect(bucketLabel('')).toBe('-');
  });
});

describe('waterLabel', () => {
  it('should return "Binnenwater" for "inland"', () => {
    expect(waterLabel('inland')).toBe('Binnenwater');
  });

  it('should return "Kustwater" for "coastal"', () => {
    expect(waterLabel('coastal')).toBe('Kustwater');
  });

  it('should return "Binnenwater + Kustwater" for "both"', () => {
    expect(waterLabel('both')).toBe('Binnenwater + Kustwater');
  });

  it('should return "-" for unknown values', () => {
    expect(waterLabel('unknown')).toBe('-');
    expect(waterLabel(null)).toBe('-');
    expect(waterLabel(undefined)).toBe('-');
  });
});

describe('toNumberOrNull', () => {
  it('should convert valid numbers', () => {
    expect(toNumberOrNull(42)).toBe(42);
    expect(toNumberOrNull('42')).toBe(42);
    expect(toNumberOrNull(3.14)).toBe(3.14);
    expect(toNumberOrNull('3.14')).toBe(3.14);
    expect(toNumberOrNull(0)).toBe(0);
    expect(toNumberOrNull('0')).toBe(0);
  });

  it('should return null for non-numeric strings and special values', () => {
    expect(toNumberOrNull('abc')).toBe(null);
    expect(toNumberOrNull(NaN)).toBe(null);
    expect(toNumberOrNull(Infinity)).toBe(null);
    expect(toNumberOrNull(-Infinity)).toBe(null);
  });

  // NOTE: Current behavior - Number(null) = 0, Number(undefined) = NaN, Number('') = 0
  // These are edge cases worth considering for future improvement
  it('should handle JavaScript coercion edge cases (current behavior)', () => {
    // Number(null) = 0, which is finite, so returns 0
    expect(toNumberOrNull(null)).toBe(0);
    // Number(undefined) = NaN, which is not finite, so returns null
    expect(toNumberOrNull(undefined)).toBe(null);
    // Number('') = 0, which is finite, so returns 0
    expect(toNumberOrNull('')).toBe(0);
  });

  it('should handle negative numbers', () => {
    expect(toNumberOrNull(-5)).toBe(-5);
    expect(toNumberOrNull('-5')).toBe(-5);
  });
});

describe('fmtNum', () => {
  it('should format kW values as integers', () => {
    expect(fmtNum(10, 'kW')).toBe('10 kW');
    expect(fmtNum(10.4, 'kW')).toBe('10 kW');
    expect(fmtNum(10.6, 'kW')).toBe('11 kW');
  });

  it('should format kWh values as integers', () => {
    expect(fmtNum(48, 'kWh')).toBe('48 kWh');
    expect(fmtNum(48.3, 'kWh')).toBe('48 kWh');
  });

  it('should format km/h values with one decimal', () => {
    expect(fmtNum(8, 'km/h')).toBe('8.0 km/h');
    expect(fmtNum(8.5, 'km/h')).toBe('8.5 km/h');
    expect(fmtNum(8.567, 'km/h')).toBe('8.6 km/h');
  });

  it('should return "-" for non-numeric strings and NaN', () => {
    expect(fmtNum('abc', 'kW')).toBe('-');
    expect(fmtNum(NaN, 'kW')).toBe('-');
  });

  // NOTE: Current behavior - null and undefined coerce to 0 due to Number() coercion
  it('should handle JavaScript coercion edge cases (current behavior)', () => {
    // Number(null) = 0, formats as "0 kW"
    expect(fmtNum(null, 'kW')).toBe('0 kW');
    // Number(undefined) = NaN, returns "-"
    expect(fmtNum(undefined, 'kW')).toBe('-');
  });
});

describe('safeString', () => {
  it('should stringify objects', () => {
    expect(safeString({ a: 1 })).toBe('{"a":1}');
    expect(safeString([1, 2, 3])).toBe('[1,2,3]');
  });

  it('should handle primitives', () => {
    expect(safeString('hello')).toBe('"hello"');
    expect(safeString(42)).toBe('42');
    expect(safeString(null)).toBe('null');
  });

  it('should handle circular references gracefully', () => {
    const circular = { a: 1 };
    circular.self = circular;
    // Should not throw, returns string representation
    expect(typeof safeString(circular)).toBe('string');
  });
});

describe('mapTripDuration', () => {
  it('should map "2-4" patterns to "2to4"', () => {
    expect(mapTripDuration('2-4 hours')).toBe('2to4');
    expect(mapTripDuration('2 to 4 uur')).toBe('2to4');
    expect(mapTripDuration('2–4 hours')).toBe('2to4');
  });

  it('should map "4-8" patterns to "4to8"', () => {
    expect(mapTripDuration('4-8 hours')).toBe('4to8');
    expect(mapTripDuration('4 to 8 uur')).toBe('4to8');
  });

  it('should map "8+" patterns to "8plus"', () => {
    expect(mapTripDuration('8+ hours')).toBe('8plus');
    expect(mapTripDuration('8 or more')).toBe('8plus');
    // NOTE: "more than 8" returns '8plus' because it contains '8' and the '+' check
    expect(mapTripDuration('more than 8')).toBe('8plus');
  });

  it('should return null for empty/invalid values', () => {
    expect(mapTripDuration(null)).toBe(null);
    expect(mapTripDuration(undefined)).toBe(null);
    expect(mapTripDuration('')).toBe(null);
    expect(mapTripDuration('short trip')).toBe(null);
  });
});

describe('getTripMin', () => {
  it('should extract minimum hours', () => {
    expect(getTripMin('2-4 hours')).toBe(2);
    expect(getTripMin('4-8 hours')).toBe(4);
    expect(getTripMin('8+ hours')).toBe(8);
  });

  it('should return null for empty/invalid values', () => {
    expect(getTripMin(null)).toBe(null);
    expect(getTripMin(undefined)).toBe(null);
    expect(getTripMin('')).toBe(null);
    expect(getTripMin('short')).toBe(null);
  });
});

describe('getTripMax', () => {
  it('should extract maximum hours', () => {
    expect(getTripMax('2-4 hours')).toBe(4);
    expect(getTripMax('4-8 hours')).toBe(8);
  });

  it('should return 12 for patterns with "+"', () => {
    expect(getTripMax('8+ hours')).toBe(12);
    expect(getTripMax('8+ uur')).toBe(12);
  });

  // NOTE: Current behavior - "over 8 hours" returns 8 because it contains '8'
  // but doesn't contain '+'. Only explicit '+' triggers the 12-hour return.
  it('should return 8 for "8" patterns without "+" (current behavior)', () => {
    expect(getTripMax('over 8 hours')).toBe(8);
    expect(getTripMax('more than 8')).toBe(8);
  });

  it('should return null for empty values', () => {
    expect(getTripMax(null)).toBe(null);
    expect(getTripMax(undefined)).toBe(null);
    expect(getTripMax('')).toBe(null);
  });
});

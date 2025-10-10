// Unit conversion utilities

// Wind speed conversions
export function kmhToKnots(kmh: number): number {
  return Math.round(kmh * 0.539957 * 10) / 10;
}

export function kmhToMs(kmh: number): number {
  return Math.round((kmh / 3.6) * 10) / 10;
}

export function knotsToKmh(knots: number): number {
  return Math.round(knots * 1.852 * 10) / 10;
}

export function msToKmh(ms: number): number {
  return Math.round(ms * 3.6 * 10) / 10;
}

// Wave height conversions
export function metersToFeet(meters: number): number {
  return Math.round(meters * 3.28084 * 10) / 10;
}

export function feetToMeters(feet: number): number {
  return Math.round((feet / 3.28084) * 10) / 10;
}

// Temperature conversions
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round((((fahrenheit - 32) * 5) / 9) * 10) / 10;
}

// Current speed conversions
export function msToKnots(ms: number): number {
  return Math.round(ms * 1.94384 * 10) / 10;
}

export function knotsToMs(knots: number): number {
  return Math.round((knots / 1.94384) * 10) / 10;
}

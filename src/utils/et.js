export function computeET({ tempC, humidityPct, windMs, solarWm2 }) {
const tFactor = 0.04 * (tempC);
const rhFactor = 1 - humidityPct / 100;
const windFactor = 0.06 * windMs;
const solarFactor = 0.0015 * solarWm2;
const eto = Math.max(0, tFactor * rhFactor + windFactor + solarFactor);
const etoScaled = Math.round((eto * 10 + Number.EPSILON) * 10) / 10;
return etoScaled;
}
import type { HouseProject } from "@/types/houseforge";

export type DisplayUnit = HouseProject["units"];

const METERS_TO_FEET = 3.280839895;
const SQUARE_METERS_TO_SQUARE_FEET = 10.7639104;

export function metersToDisplay(valueMeters: number, units: DisplayUnit): number {
  return units === "imperial" ? valueMeters * METERS_TO_FEET : valueMeters;
}

export function displayToMeters(value: number, units: DisplayUnit): number {
  return units === "imperial" ? value / METERS_TO_FEET : value;
}

export function parseLengthInput(input: string, units: DisplayUnit): number | undefined {
  const value = input.trim();
  if (!value) return undefined;
  if (units === "metric") {
    const parsed = Number(value.replace(/[a-z\s]/gi, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  const compound = value.match(/^\s*(\d+(?:\.\d+)?)\s*(?:'|ft)?\s*(?:(\d+(?:\.\d+)?)\s*(?:\"|in)?)?\s*$/i);
  if (!compound) return undefined;
  const feet = Number(compound[1]);
  const inches = Number(compound[2] ?? 0);
  if (!Number.isFinite(feet) || !Number.isFinite(inches) || inches >= 12) return undefined;
  return (feet + inches / 12) / METERS_TO_FEET;
}

export function formatLength(valueMeters: number, units: DisplayUnit, digits = 2): string {
  const value = metersToDisplay(valueMeters, units);
  return `${value.toFixed(digits)} ${units === "imperial" ? "ft" : "m"}`;
}

export function formatArea(valueSquareMeters: number, units: DisplayUnit, digits = 1): string {
  const value = units === "imperial" ? valueSquareMeters * SQUARE_METERS_TO_SQUARE_FEET : valueSquareMeters;
  return `${value.toFixed(digits)} ${units === "imperial" ? "ft²" : "m²"}`;
}

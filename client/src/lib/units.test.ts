import { describe, expect, it } from "vitest";
import { displayToMeters, formatArea, formatLength, metersToDisplay, parseLengthInput } from "./units";

describe("HOUSEFORGE X display units", () => {
  it("converts the shared meter model to imperial values without changing the model", () => {
    expect(metersToDisplay(1, "imperial")).toBeCloseTo(3.28084, 4);
    expect(displayToMeters(3.280839895, "imperial")).toBeCloseTo(1, 6);
  });

  it("formats lengths and areas for the active display unit", () => {
    expect(formatLength(3.2, "metric")).toBe("3.20 m");
    expect(formatLength(3.2, "imperial")).toBe("10.50 ft");
    expect(formatArea(10, "imperial")).toBe("107.6 ft²");
  });

  it("parses feet-and-inches values back to the meter-based shared model", () => {
    expect(parseLengthInput(`10' 6\"`, "imperial")).toBeCloseTo(3.2004, 3);
    expect(parseLengthInput("3.2", "metric")).toBe(3.2);
    expect(parseLengthInput("5' 12\"", "imperial")).toBeUndefined();
  });
});

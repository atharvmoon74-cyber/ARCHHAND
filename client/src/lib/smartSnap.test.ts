import { describe, expect, it } from "vitest";
import { smartSnapDetail, smartSnapPoint } from "./smartSnap";

describe("HOUSEFORGE X smart snap", () => {
  it("prefers a nearby shared geometry endpoint over the plain grid", () => {
    expect(smartSnapPoint({ x: 1.07, z: 1.03 }, { enabled: true, grid: 0.25, candidates: [{ x: 1, z: 1 }] })).toEqual({ x: 1, z: 1 });
  });

  it("falls back to the active precision grid when no endpoint is nearby", () => {
    expect(smartSnapPoint({ x: 1.12, z: 1.14 }, { enabled: true, grid: 0.25 })).toEqual({ x: 1, z: 1.25 });
  });

  it("preserves freehand coordinates when snapping is disabled", () => {
    expect(smartSnapPoint({ x: 1.12, z: 1.14 }, { enabled: false, grid: 0.25 })).toEqual({ x: 1.12, z: 1.14 });
  });

  it("reports whether the precision point originates from an endpoint or grid", () => {
    expect(smartSnapDetail({ x: 1.07, z: 1.03 }, { enabled: true, grid: .25, candidates: [{ x: 1, z: 1 }] })).toMatchObject({ point: { x: 1, z: 1 }, source: "endpoint" });
    expect(smartSnapDetail({ x: 1.12, z: 1.14 }, { enabled: true, grid: .25 })).toMatchObject({ point: { x: 1, z: 1.25 }, source: "grid" });
  });
});

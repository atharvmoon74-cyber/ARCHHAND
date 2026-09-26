import { describe, expect, it } from "vitest";
import { areaSchedule, cloneProject, createElement, createRoom, defaultCorners, defaultProject, detectAxisAlignedRoom, nearestWallIntersection, propagateLevelElevations, quantify, reconcileProjectRelationships, siteAssetPlacement, validateProject } from "./houseforge";

describe("HOUSEFORGE project model", () => {
  it("creates an editable empty site with one ground level", () => {
    const project = defaultProject(true);
    expect(project.levels).toHaveLength(1);
    expect(project.rooms).toHaveLength(0);
    expect(project.site.width).toBe(12);
    expect(project.site.corners).toHaveLength(4);
  });

  it("derives stable rectangular plot corners from exact site dimensions", () => {
    expect(defaultCorners(10, 16)).toEqual([{ x: -5, z: -8 }, { x: 5, z: -8 }, { x: 5, z: 8 }, { x: -5, z: 8 }]);
  });

  it("keeps conceptual terrain-elevation points in the shared project snapshot", () => {
    const project = defaultProject(true);
    project.site.terrainPoints = [{ x: 1.2, z: -2.4, elevation: 0.25 }];
    expect(cloneProject(project).site.terrainPoints).toEqual([{ x: 1.2, z: -2.4, elevation: 0.25 }]);
  });

  it("anchors road edges and boundaries to the configured road context", () => {
    const site = defaultProject(true).site;
    expect(siteAssetPlacement(site, "Site road edge", [8, .05, 2.8]).position).toEqual([0, .03, -10.2]);
    expect(siteAssetPlacement(site, "Sliding vehicle gate", [3.6, 1.5, .1]).position).toEqual([0, .75, -9]);
  });

  it("keeps driveway, parking, road, and gate records aligned to an east road context", () => {
    const site = { ...defaultProject(true).site, road: "east" as const };
    expect(siteAssetPlacement(site, "Site road edge", [8, .05, 2.8]).position).toEqual([7.2, .03, 0]);
    expect(siteAssetPlacement(site, "Driveway", [3, .04, 5]).position).toEqual([4.65, .03, 0]);
    expect(siteAssetPlacement(site, "Parking bay", [2.6, .04, 5.2]).position).toEqual([4.65, .03, 0]);
    expect(siteAssetPlacement(site, "Sliding vehicle gate", [3.6, 1.5, .1])).toEqual({ position: [6, .75, 0], rotation: [0, Math.PI / 2, 0] });
  });

  it("finds the nearest crossing of a free wall segment against placed walls", () => {
    const wall = createElement("wall", "ground", [0, 1.5, 0]);
    wall.dimensions = [8, 3, .15];
    expect(nearestWallIntersection({ x: -3, z: -3 }, { x: 3, z: 3 }, [wall])).toEqual({ x: 0, z: 0 });
  });

  it("detects a closed axis-aligned room from four enclosing wall segments", () => {
    const wall=(x:number,z:number,length:number,rotation:number)=>{const item=createElement("wall","ground",[x,1.5,z]);item.dimensions=[length,3,.15];item.rotation=[0,rotation,0];return item;};
    expect(detectAxisAlignedRoom([wall(0,-2,6,0),wall(0,2,6,0),wall(-3,0,4,Math.PI/2),wall(3,0,4,Math.PI/2)])).toEqual({x:-3,z:-2,width:6,length:4});
  });

  it("keeps expanded room-programme templates as editable shared plan records", () => {
    const garage = createRoom("Garage", "ground", -2, 1, 3.2, 5.6);
    const balcony = createRoom("Balcony", "ground", 2, -1, 3.4, 1.7);
    expect(garage).toMatchObject({ name: "Garage", levelId: "ground", width: 3.2, length: 5.6, floorMaterial: "tile" });
    expect(balcony).toMatchObject({ name: "Balcony", levelId: "ground", width: 3.4, length: 1.7, wallFinish: "Warm white" });
  });

  it("reconciles hosted openings and linked stairs after shared geometry or level changes", () => {
    const project = defaultProject(true);
    const wall = createElement("wall", "level-ground", [2, 1.5, 3]);
    wall.dimensions = [4, 3, .15];
    wall.rotation = [0, Math.PI / 2, 0];
    const door = createElement("door", "level-ground");
    door.openingFor = wall.id;
    door.openingOffset = 99;
    const upper = { ...project.levels[0]!, id: "level-one", name: "Level One", elevation: 3.8 };
    const stair = createElement("stair", "level-ground", [0, .8, 0]);
    stair.stairToLevelId = upper.id;
    project.levels.push(upper);
    project.elements = [wall, door, stair];
    const reconciled = reconcileProjectRelationships(project);
    expect(reconciled.elements.find((item) => item.id === door.id)).toMatchObject({ openingOffset: 1.45, position: [2, 1.05, 4.45], rotation: [0, Math.PI / 2, 0] });
    expect(reconciled.elements.find((item) => item.id === stair.id)).toMatchObject({ dimensions: [2, 3.8, 6.48], position: [0, 1.9, 0], stairToLevelId: "level-one" });
    expect(reconciled.elements.find((item) => item.id === stair.id)?.notes).toContain("24 risers");
    const resizedLevels = propagateLevelElevations([{ ...project.levels[0]!, floorHeight: 4.1 }, upper]);
    const regenerated = reconcileProjectRelationships({ ...project, levels: resizedLevels });
    expect(regenerated.levels[1]?.elevation).toBe(4.1);
    expect(regenerated.elements.find((item) => item.id === stair.id)).toMatchObject({ dimensions: [2, 4.1, 6.75], position: [0, 2.05, 0] });
    expect(regenerated.elements.find((item) => item.id === stair.id)?.notes).toContain("25 risers");
    const detached = reconcileProjectRelationships({ ...project, elements: [door] });
    expect(detached.elements[0]).toMatchObject({ openingFor: undefined, openingOffset: undefined });
  });

  it("creates an isolated snapshot for undo and redo history", () => {
    const original = defaultProject();
    const snapshot = cloneProject(original);
    snapshot.name = "Changed residence";
    snapshot.elements[0]!.name = "Changed footing";
    expect(original.name).not.toBe(snapshot.name);
    expect(original.elements[0]!.name).not.toBe(snapshot.elements[0]!.name);
  });

  it("generates model-derived area and quantity schedules", () => {
    const project = defaultProject();
    const area = areaSchedule(project);
    const quantities = quantify(project);
    expect(area.plot).toBe(216);
    expect(area.built).toBeGreaterThan(0);
    expect(quantities.find((row) => row.label === "Concrete / RCC")?.quantity).toBeGreaterThan(0);
    expect(quantities.find((row) => row.label === "Doors")?.quantity).toBeGreaterThan(0);
  });

  it("warns when an unfinished model has no foundations or roof", () => {
    const checks = validateProject(defaultProject(true));
    expect(checks.some((check) => check.title === "No foundations placed")).toBe(true);
    expect(checks.some((check) => check.title === "Roof not defined")).toBe(true);
  });
});

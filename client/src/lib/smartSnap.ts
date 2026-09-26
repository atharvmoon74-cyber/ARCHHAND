export type PlanPoint = { x: number; z: number };
export type SmartSnapResult = { point: PlanPoint; source: "free" | "grid" | "endpoint"; distance: number; };

export function smartSnapPoint(point: PlanPoint, options: { enabled: boolean; grid: number; candidates?: PlanPoint[]; threshold?: number }): PlanPoint {
  return smartSnapDetail(point,options).point;
}

export function smartSnapDetail(point: PlanPoint, options: { enabled: boolean; grid: number; candidates?: PlanPoint[]; threshold?: number }): SmartSnapResult {
  if (!options.enabled) return { point, source:"free", distance:0 };
  const threshold = options.threshold ?? Math.max(options.grid * 0.42, 0.16);
  const candidate = options.candidates?.find((item) => Math.hypot(item.x - point.x, item.z - point.z) <= threshold);
  if (candidate) return { point:{ x: Number(candidate.x.toFixed(3)), z: Number(candidate.z.toFixed(3)) }, source:"endpoint", distance:Number(Math.hypot(candidate.x-point.x,candidate.z-point.z).toFixed(3)) };
  const snapped={ x: Number((Math.round(point.x / options.grid) * options.grid).toFixed(3)), z: Number((Math.round(point.z / options.grid) * options.grid).toFixed(3)) };
  return { point:snapped, source:"grid", distance:Number(Math.hypot(snapped.x-point.x,snapped.z-point.z).toFixed(3)) };
}

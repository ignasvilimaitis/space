import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { CatmullRomCurve3, Vector3 } from "three";

const SCALE = 1 / 1_000_000     
const STEP_HOURS = 1   
const HOURS_PER_SECOND = 1       

export function getOrbitCurve(planetData: any) {
    const orbit = useMemo(() => {
        if (!planetData?.length) return null
        const points = planetData.map(
          (d: { x: number; z: number; y: number }) =>
            // Horizons is Z-up (ecliptic); three.js is Y-up
            new Vector3(d.x * SCALE, d.z * SCALE, -d.y * SCALE)
        )
        return {
          curve: new CatmullRomCurve3(points, false, 'catmullrom'),
          totalDays: (points.length - 1) * STEP_HOURS,
        }
      }, [planetData])
    
    return orbit

}

export function setPlanetPosition(planetOrbit: any, group: any) {
  try {
    useFrame((state) => {
      if (!group.current || !planetOrbit) return
      const days = state.clock.elapsedTime * HOURS_PER_SECOND
      const u = (days / planetOrbit.totalDays) % 1
      planetOrbit.curve.getPoint(u, group.current.position) 
    }) 
} catch (e) {
  console.log("error for planet " + planetOrbit)
}
  }

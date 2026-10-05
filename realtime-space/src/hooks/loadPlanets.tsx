// hooks/usePlanetaryData.ts
import { useEffect, useState } from "react";
import { getCurrentClock } from "../functions/convertDate";
import type { SimClock } from "../components/menu/timeControl";

const PLANETS = ["mercury","venus","earth","mars","jupiter","saturn","uranus","neptune"];

export function loadAllPlanetaryData(clock: SimClock) {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const currentDate = getCurrentClock(clock);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const entries = await Promise.all(
          PLANETS.map(async (planet) => {

            const res = await fetch(`http://localhost:3000/api/get/${planet}?startMs=${currentDate}&stopMs=2027-02-05 16:24:18&step_size=1h`);
            if (!res.ok) throw new Error(`Failed for ${planet}: ${res.status}`);
            const json = await res.json();
            return [planet, json] as const;
          })
        );
        setData(Object.fromEntries(entries));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch planetary data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [currentDate]);

  return { data, loading, error };
}
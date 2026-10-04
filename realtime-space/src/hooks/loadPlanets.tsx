// hooks/usePlanetaryData.ts
import { useEffect, useState } from "react";

const PLANETS = ["mercury","venus","earth","mars","jupiter","saturn","uranus","neptune"];

export function loadAllPlanetaryData() {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const entries = await Promise.all(
          PLANETS.map(async (planet) => {
            const res = await fetch(`http://localhost:3000/api/get/${planet}`);
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
  }, []);

  return { data, loading, error };
}
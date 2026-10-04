import { useEffect, useState } from "react";


export function loadPlanetaryData(planet: string) {
  const [data, setData] = useState<Record<string, any>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/get/${planet}`);
        if (!res.ok) throw new Error(`Failed for ${planet}: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch planets' data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { data, loading, error };
}
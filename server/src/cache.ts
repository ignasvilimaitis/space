let horizonsQueue: Promise<unknown> = Promise.resolve();


const cache = new Map<string, { promise: Promise<any>; expires: number }>();
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour; use Infinity if queries are fixed-date

export function queuedFetch(url: string, ttlMs = DEFAULT_TTL_MS): Promise<any> {
    const cached = cache.get(url);
    if (cached && cached.expires > Date.now()) {
        return cached.promise; // hit (resolved or still in flight)
    }

    const promise = horizonsQueue.then(() => getData(url));
    horizonsQueue = promise.catch(() => {});

    cache.set(url, { promise, expires: Date.now() + ttlMs });
    promise.catch(() => {
        if (cache.get(url)?.promise === promise) cache.delete(url);
    });

    return promise;
}

export async function getData(requestUrl: string) {
    const response = await(fetch(requestUrl));
    if (!response.ok) {
        const text = await response.text();
        console.error("Error response from NASA API:", text);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        const text = await response.text();
        console.error(`Expected JSON, got ${contentType}`);
        console.error(text.slice(0, 500));
        throw new Error("Horizons did not return JSON");
    }
    const jsonData = await response.json();
    return jsonData
}



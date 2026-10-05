// finding the window of time to display in the simulation (based on sim speed)

import type { SimClock } from "../components/menu/timeControl";
import { getCurrentClock } from "./convertDate";

export function calculateWindow(clock: SimClock) {
    const currentDate = getCurrentClock(clock);
    const simSpeed = clock.speedRef.current;
    console.log(simSpeed)
}


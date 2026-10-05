// finding the window of time to display in the simulation (based on sim speed)

import { useSimClock } from "../components/menu/timeControl";
import { getCurrentClock } from "./convertDate";

export function calculateWindow() {
    const clock = useSimClock();
    const currentDate = getCurrentClock();

    const simSpeed = clock.speedRef.current;

    console.log(simSpeed)
}


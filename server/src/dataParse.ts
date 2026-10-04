interface velocityData {
    planet:string;
    timestamp: string; // in epoch (or julian date)
    calenderDate: string;
    x: number; // position
    y: number; // position
    z: number; // position
    vx: number; // velocity 
    vy: number; // velocity
    vz: number; // velocity
}

/**
 * 
 * @param Unparsed data from NASA API
 * @returns Usable data to send to front-end
 */

export function parseData(data: string, planet: string) { // TODO: Cast to a type

    const velocityStartMarker = "$$SOE";
    const velocityEndMarker = "$$EOE";
    
    
    const dataBlock = data.slice((data.indexOf(velocityStartMarker) + velocityStartMarker.length), data.indexOf(velocityEndMarker)); 
    // slices the data from the start of the velocity data to the end of the velocity data;
    const dataLines = dataBlock.trim().split("\n");
    const velocityDataArray: velocityData[] = [];
    for (const line of dataLines) {
        const fields = line.trim().split(",");
        // Check if the line has at least 8 fields -> so that we can safely access fields[0] to fields[7]
        if (fields.length < 8) {
            throw new Error("Invalid data format: expected at least 8 fields per line.");
        } 
        const velocityData: velocityData = { // Used ! as we have already checked that the fields exist
            planet: planet,
            timestamp: fields[0]!,
            calenderDate: fields[1]!,
            x: parseFloat(fields[2]!),
            y: parseFloat(fields[3]!),
            z: parseFloat(fields[4]!),
            vx: parseFloat(fields[5]!),
            vy: parseFloat(fields[6]!),
            vz: parseFloat(fields[7]!),
        };
        velocityDataArray.push(velocityData);
    }
    return velocityDataArray;

}
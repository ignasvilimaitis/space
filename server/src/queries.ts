

interface HorizonsQuery {
    COMMAND: string;
    CENTER: string;
    EPHEM_TYPE: string;
    START_TIME: string;
    STOP_TIME: string;
    STEP_SIZE: string;
}

export function buildQuery(query: HorizonsQuery) : string {
    const params = new URLSearchParams(
        {
            format: "json",
            COMMAND: query.COMMAND,
            CENTER: query.CENTER,
            OBJ_DATA: "YES",
            MAKE_EPHEM: "YES",
            VEC_TABLE: "3",
            EPHEM_TYPE: query.EPHEM_TYPE,
            START_TIME: query.START_TIME,
            STOP_TIME: query.STOP_TIME,
            STEP_SIZE: query.STEP_SIZE,
            CSV_FORMAT: "YES",
        }
    )

    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?${params.toString()}`;
    return url;
}   
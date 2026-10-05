import express from 'express';
import cors from 'cors';
import { parseData } from './dataParse.js'
import { buildQuery } from './queries.js';
import { queuedFetch } from './cache.js';

const app = express();
app.use(cors());
const port = 3000;


const planetCommands: Record<string, string> = {
    mercury: "199",
    venus: "299",
    earth: "399",
    mars: "499",
    jupiter: "599",
    saturn: "699",
    uranus: "799",
    neptune: "899",
    pluto: "999"
}

// app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
//     console.log("Params:", req.params);
//     console.log("Query:", req.query);
//     console.log("Body:", req.body);
//     next();
// });

app.get('/api/get/:planet', async (req, res) => {

    const planetName = req.params.planet;
    const command = planetCommands[planetName];
    const {startMs, stopMs, stepSize} = req.query;



    if (!command) {
    return res.status(400).json({ error: `Unknown planet: ${planetName}` });
}
    try {
        const planetData = await queuedFetch(buildQuery({
        COMMAND: command,
        CENTER: "500@10", // 500@10 is the command for the Sun (to get distances/data from sun)
        EPHEM_TYPE: "VECTORS",
        START_TIME: `'${startMs}'`,
        STOP_TIME: `'${stopMs}'`,
        STEP_SIZE: "1h"
    }));
    
    const parsedData = parseData(planetData.result, planetName);
    res.status(200).json(parsedData)

    } catch (err) {
        console.log(err)
        res.status(500).json("Error fetching data from NASA API: " + err);
    }
    
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




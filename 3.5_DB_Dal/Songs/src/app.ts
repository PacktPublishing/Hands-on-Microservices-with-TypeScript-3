
import * as fs from "fs";
import * as util from "util";
import { SongDal } from "./dal/dal-songs";
import { Logger } from "./logger";
import { IConfiguration } from "./types/config";
import * as express from "express";
import * as cors from "cors";
import * as url from "url";

// convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

// getting the configuration from file for now
async function getConfig(): Promise<IConfiguration> {
    let content: any = await readFile("./config.json", "utf8");
    return JSON.parse(content) as IConfiguration;
}

async function main() {
    let conf = await getConfig();

    // can use winston or bunyan in real applications (coloring & format)
    let logger = new Logger(conf.logLevel);
    let songs: SongDal = new SongDal(logger);

    logger.debug("running with configuration: ", JSON.stringify(conf));

    // now using a cors header (allow origin)
    let app: express.Express = express();

    let corsOptions: cors.CorsOptions = {
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        origin: "http://localhost:3001",
    };

    app.use(cors(corsOptions));
    app.get("/v1/songs", (req: express.Request, res: express.Response): any => {
        let urlParts = url.parse(req.url, true);
        let id: string = req.query.id;

        if (id) {
            let song = songs.getSongById(id);
            res.send(song);
        } else if (req.query.q) {
            let query = req.query.q;
            res.send(songs.getSongSearch(query));
        } else {
            res.send(songs.map);
        }
    });

    app.listen(3000, () => {
        logger.info("Service listening on port 3000!");
    });

}
main();

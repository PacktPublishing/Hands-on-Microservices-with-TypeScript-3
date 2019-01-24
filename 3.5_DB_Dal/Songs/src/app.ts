
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

    // add all songs to database for this sample:
    songs.populate();

    logger.debug("running with configuration: ", JSON.stringify(conf));
    let app: express.Express = express();

    app.get("/v1/songs", async (req: express.Request, res: express.Response) => {
        let urlParts = url.parse(req.url, true);

        let id: string = req.query.id;
        if (id) {
            let song = await songs.getSongById(id);
            res.send(song);
        } else if (req.query.q) {
            let query = req.query.q;
            res.send(await songs.getSongSearch(query));
        } else {
            res.send(await songs.getAllSongs());
        }
    });

    app.listen("3000", () => {
        logger.info("Service listening on port 3000!");
    });

}
main();

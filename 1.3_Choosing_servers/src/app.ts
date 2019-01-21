
import * as fs from "fs";
import * as util from "util";
import * as url from "url";
import { SongDal } from "./dal/dal-songs";
import { Logger } from "./logger";
import { IConfiguration } from "./types/config";
import express = require("express");

// convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

// getting the configuration from file for now
async function getConfig(): Promise<IConfiguration> {
    let content: any = await readFile("./config.json", "utf8");
    return JSON.parse(content) as IConfiguration;
}

async function main() {
    let songs: SongDal = new SongDal();
    let conf = await getConfig();

    let logger = new Logger(conf.logLevel);
    logger.debug("running with configuration: ", JSON.stringify(conf));

    let app: express.Express = express();

    app.get("/v1/songs", (req: express.Request, res: express.Response): any => {
        let urlParts = url.parse(req.url, true);
        let query = urlParts.query;
        let id: string = req.query.id;
        if (id) {
            let song = songs.getSongById(id);
            res.send(song);
        } else {
            res.send(songs);
        }
    });

    app.listen(3000, () => {
        logger.info("Service listening on port 3000!");
    });

}
main();
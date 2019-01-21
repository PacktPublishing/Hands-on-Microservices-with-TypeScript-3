
import * as fs from "fs";
import * as util from "util";
import { SongDal } from "./dal/dal-songs";
import { DalRedis } from "./dal/redis-cache";
import { Logger } from "./logger";
import { IConfiguration } from "./types/config";
import * as express from "express";
import * as process from "process";
import * as url from "url";

// convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

// getting the configuration from file for now
async function getConfig(): Promise<IConfiguration> {
    let content: any = await readFile("./config.json", "utf8");
    return JSON.parse(content) as IConfiguration;
}

async function main() {

    let redisHost = "localhost";
    let redisPort = 3020;

    let mongoHost = "localhost";
    let mongoPort = 3017;

    let conf = await getConfig();

    // can use winston or bunyan in real applications (coloring & format)
    let logger = new Logger(conf.logLevel);

    let songs: SongDal = new SongDal(logger, mongoHost, mongoPort);

    logger.debug("running with configuration: ", JSON.stringify(conf));

    let redis = new DalRedis(logger, redisHost, redisPort);
    let rres = await redis.getAsync("mykey");
    logger.debug("mykey value = ", rres);
    await redis.setAsync("mykey", "12345");
    rres = await redis.getAsync("mykey");
    logger.debug("mykey value = ", rres);

    let app: express.Express = express();

    app.get("/v1/songs", (req: express.Request, res: express.Response): any => {
        let urlParts = url.parse(req.url, true);
        let query = urlParts.query;
        let id: string = req.query.id;
        if (id) {
            let song = songs.getSongById(id);
            res.send(song);
        } else if (req.query.q) {
            let songQuery = req.query.q;
            res.send(songs.getSongSearch(songQuery));
        } else {
            res.send(songs.map);
        }
    });

    app.listen(3000, () => {
        logger.info("Service listening on port 3000!");
    });

}
main();

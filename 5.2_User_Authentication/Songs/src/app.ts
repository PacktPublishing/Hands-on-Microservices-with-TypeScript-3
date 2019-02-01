
import * as fs from "fs";
import * as util from "util";
import { SongDal } from "./dal/dal-songs";
import { DalRedis } from "./dal/redis-cache";
import { Etcd } from "./dal/etcd";
import { Logger } from "./logger";
import { IConfiguration } from "./types/config";
import * as express from "express";
import * as process from "process";
import * as url from "url";
import * as ejwt from "express-jwt";
let mysecret = "my-secret-423895230789@!#$hgfjksd2fgvjk3721356";

// convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

// getting the configuration from file for now
async function getConfig(): Promise<IConfiguration> {
    let content: any = await readFile("./config.json", "utf8");
    return JSON.parse(content) as IConfiguration;
}

async function main() {

    let redisHost = process.env["REDIS_SERVICE_HOST"] || "localhost";
    let redisPort = process.env["REDIS_SERVICE_PORT_RESP"] || "3020";

    let mongoHost = process.env["MONGO_SERVICE_HOST"] || "localhost";
    let mongoPort = process.env["MONGO_SERVICE_PORT_TCP"] || "3017";

    let etcdHost = process.env["ETCD_SERVICE_HOST"] || "localhost";
    let etcdPort = process.env["ETCD_SERVICE_PORT_HTTP"] || "3021";

    let confDal = new Etcd(etcdHost + ":" + etcdPort);
    await confDal.populate();

    let conf = await confDal.getConfig();
    await confDal.setWatchers(conf);
    let logger = new Logger(conf.logLevel);

    conf.on("changed", () => {
        logger.logLevel = conf.logLevel;
    });

    let songs: SongDal = new SongDal(logger, mongoHost, Number.parseInt(mongoPort, 10));

    songs.delete();
    songs.populate();
    logger.info("loglevel:", logger.logLevel);
    logger.debug("running with configuration: ", JSON.stringify(conf));

    let app: express.Express = express();
    // app.use(ejwt({ secret: mysecret, userProperty: "idtoken" }));



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

    app.listen(3000, () => {
        logger.info("Service listening on port 3000!");
    });

}
main();

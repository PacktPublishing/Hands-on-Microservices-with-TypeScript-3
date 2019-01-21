
import * as fs from "fs";
import * as util from "util";
import * as url from "url";
import { PlaylistDal } from "./dal/dal-playlists";
import { Logger } from "./logger";
import { IConfiguration } from "./types/config";
import { ListItem } from "./types/list-item";
import * as express from "express";
import * as cors from "cors";
import { Playlist } from "playlist";
import bodyParser = require("body-parser");

// convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

// getting the configuration from file for now
async function getConfig(): Promise<IConfiguration> {
    let content: any = await readFile("./config.json", "utf8");
    return JSON.parse(content) as IConfiguration;
}

async function main() {
    let playlists: PlaylistDal = new PlaylistDal();
    let conf = await getConfig();

    // no authentication yet, set our user as #2
    let currentUserId = "2";

    // can use winston or bunyan in real applications (coloring & format)
    let logger = new Logger(conf.logLevel);

    logger.debug("running with configuration: ", JSON.stringify(conf));

    // now using a cors header (allow origin)
    let app: express.Express = express();

    // app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    let corsOptions: cors.CorsOptions = {
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        origin: "http://localhost:3001",
    };

    app.use(cors(corsOptions));
    app.get("/v1/playlists", (req: express.Request, res: express.Response): any => {
        let urlParts = url.parse(req.url, true);
        let query = urlParts.query;
        let plists: Playlist[] = [];
        if (req.query.id) {
            let id: string = req.query.id;
            let plist = playlists.getPlaylistById(id);
            plists = [plist];
        } else if (req.query.userId) {
            let userId = req.query.userId;
            let owned: boolean = req.query.onlyOwned === "true";
            if (!owned) {
                owned = false;
            }
            plists = playlists.getPlaylistsByUser(userId, owned);
        }
        if (plists) {
            res.send(plists);
        }
    });

    app.post("/v1/playlists/:id/", (req: express.Request, res: express.Response): any => {
        let urlParts = url.parse(req.url, true);
        let listId: string = req.params.id as string;
        let songId: string = urlParts.query.songId as string;
        let err = playlists.addItemToPlaylist(currentUserId, listId, songId);
        if (err) {
            res.status(401).send(err.message);
        }
        res.end();
    });

    app.delete("/v1/playlists/:id/", (req: express.Request, res: express.Response): any => {
        let urlParts = url.parse(req.url, true);
        let listId: string = req.params.id as string;
        let songId: string = urlParts.query.songId as string;
        let err = playlists.removeItemFromPlaylist(currentUserId, listId, songId);
        if (err) {
            res.status(401).send(err.message);
        }
        res.end();
    });
    // add a playlist
    app.post("/v1/playlists", (req: express.Request, res: express.Response): any => {
        let listItem: Playlist = req.body;
        if (listItem) {
            let id: string = req.query.id;
            let plist = playlists.addNewPlaylist(listItem);
            res.send(plist);
        } else {
            logger.error("Playlists API post: no list item in body!");
            res.status(404).send("No Item to add");
        }
    });

    // delete a playlist
    app.delete("/v1/playlists", (req: express.Request, res: express.Response): any => {
        let urlParts = url.parse(req.url, true);
        let listId: string = urlParts.query.id as string;
        if (listId) {
            let err = playlists.delPlaylist(currentUserId, listId);
            if (err) {
                res.status(401).send(err.message);
            }
            res.end();
        } else {
            logger.error("Playlists API delete: no id in query!");
            res.status(404).send("No Item found to delete");
        }
    });

    app.listen(3002, () => {
        logger.info("Service listening on port 3002!");
    });

}
main();

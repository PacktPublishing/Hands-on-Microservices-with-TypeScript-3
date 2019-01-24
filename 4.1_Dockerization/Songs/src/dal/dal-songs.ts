import { ISong } from "../types/song";
import mongoose = require("mongoose");
import { Logger } from "../logger";
import * as fs from "fs";

export class SongDal {
    public map: Map<string, ISong> = new Map<string, ISong>();
    private db: mongoose.Connection;
    private logger: Logger;
    private songs: mongoose.Model<mongoose.Document>;
    private songsModelSchema: mongoose.Schema;
    constructor(logger: Logger) {
        // Define a schema
        this.songsModelSchema = new mongoose.Schema({
            name: String,
            id: String,
            artist: String,
        });

        this.songs = mongoose.model("Songs", this.songsModelSchema);
        // Set up default mongoose connection

        let mongoDB = "mongodb://mongo:27017/demo1";
        mongoose.connect(mongoDB);
        // Get Mongoose to use the global promise library
        mongoose.Promise = global.Promise;
        // Get the default connection
        this.db = mongoose.connection;
        this.logger = logger;
        // Bind connection to error event (to get notification of connection errors)
        this.db.on("error", (err) => {
            this.logger.error("MongoDB connection error:", err);
        });
    }
    public async populate() {
        this.map = new Map();
        this.songs = mongoose.model("Songs", this.songsModelSchema);
        let contents = fs.readFileSync("songs.json");
        let songArr: ISong[] = JSON.parse(contents.toString());

        await this.songs.insertMany(songArr);
    }
    public async delete() {
        this.db.dropCollection("songs");
    }
    private mongo2song(doc: mongoose.Document): ISong {
        let song = {
            id: doc["id"],
            playtimeSecs: doc["playtimeSecs"] || 0,
            name: doc["name"] || "",
            artist: doc["artist"] || "",
            link: doc["link"] || "",
            fullName: doc["name"] + " " + doc["artist"],
        };
        return song;
    }
    public async getAllSongs(): Promise<ISong[]> {
        return this.getSongSearch(".*");
    }

    public async getSongSearch(q: string): Promise<ISong[]> {
        let songs: ISong[] = [];

        // ignore this huge security issue for the sake of the sample...
        let re = new RegExp(q, "i");

        // search for the partial string in the collection as artist
        let retList = await this.songs.find(
            {
                $or: [
                    { artist: re },
                    { name: re },
                ],
            }).exec();

        for (let i = 0; i < retList.length; i++) {
            let doc = retList[i];
            let song = this.mongo2song(doc);
            songs.push(song);
        }

        return songs;
    }

    public async getSongById(id1: string): Promise<ISong> {
        let res = await this.songs.find({ id: id1 }).exec();
        let doc = res[0];
        let song = this.mongo2song(doc);
        return song;
    }
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util = require("util");
const url = require("url");
const dal_songs_1 = require("./dal/dal-songs");
const logger_1 = require("./logger");
const express = require("express");
// can use winston or bunyan in real applications (coloring & format)
const logger = new logger_1.Logger();
// convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);
// getting the configuration from file for now
function getConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield readFile("./config.json", "utf8");
        return JSON.parse(content);
    });
}
function main() {
    let songs = new dal_songs_1.SongDal();
    getConfig().then((conf) => {
        logger.debug("running with configuration: ", JSON.stringify(conf));
        let app = express();
        app.get("/song", (req, res) => {
            let urlParts = url.parse(req.url, true);
            let query = urlParts.query;
            let id = req.query.id;
            let song = songs.getSongById(id);
            res.send(song);
        });
        app.listen(3000, () => {
            logger.info("Service listening on port 3000!");
        });
    });
}
main();

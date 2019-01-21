"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dal_songs_1 = require("../src/dal/dal-songs");
describe("Hello World Server", function () {
    describe("query DB for single song", function () {
        it("returns a song result", function () {
            let db = new dal_songs_1.SongDal();
            let song = db.getSongById("2");
            expect(song).toBeDefined();
            expect(song.id).toBe(2);
        });
    });
});

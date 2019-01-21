import { SongDal } from "../src/dal/dal-songs";
import { Logger } from "../src/logger";
import chai = require("chai");

describe("Songs Service", () => {
  let db;
  before(async () => {
    let logger = new Logger("debug");
    db = new SongDal(logger);
    await db.populate();
  });
  after(async () => {
    db.delete();
  });

  describe("query DB for single song", () => {
    it("returns a song result", async () => {
      let song = await db.getSongById("2");
      chai.assert(song, "no song returned from DB");
      chai.assert(song.id === "2", "error in song id");
    });
  });

  describe("query DB for multiple songs", () => {
    it("returns some results", async () => {

      let songs = await db.getSongSearch("kiss");
      chai.assert(songs, "songs object returned undefined");
      chai.assert(songs.length > 0, "no songs in collection");
    });
  });
});
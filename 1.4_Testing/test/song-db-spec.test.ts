import { SongDal } from "../src/dal/dal-songs";
import chai = require("chai");

describe("Songs Service", () => {
  describe("query DB for single song", () => {
    it("returns a song result", () => {
      let db = new SongDal();
      let song = db.getSongById("2");
      chai.assert(song, "error in status code");
      chai.assert(song.id === 2, "error in status code");
    });
  });
});
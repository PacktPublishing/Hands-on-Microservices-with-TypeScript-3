import { PlaylistDal } from "../src/dal/dal-playlists";
import chai = require("chai");

describe("Playlist Server", () => {
  describe("query DB for playlists", () => {
    it("returns a list result", () => {
      let db = new PlaylistDal();
      let plist = db.getPlaylistsById("2");
      
      chai.assert(plist, "no item retrieved");
      chai.assert(plist.id === "2", "wrong item id");
      
    });
    it("returns list results for user", () => {
      let db = new PlaylistDal();
      let plist = db.getPlaylistsByUser("1");
      
      chai.assert(plist, "retrieved song list is undefined");
      chai.assert(plist.length > 0, "no items in playlist");
    });
  });
});
import { PlaylistDal } from "../src/dal/dal-playlists";
import { ListItem } from "../src/types/list-item";
import chai = require("chai");
import { Playlist } from "../src/types/playlist";

describe("Playlist Server", () => {
  describe("query DB for playlists", () => {
    it("returns a list result", () => {
      let db = new PlaylistDal();
      let plist = db.getPlaylistById("2");

      chai.assert(plist, "no item retrieved");
      chai.assert(plist.id === "2", "wrong item id");
    });

    it("returns list results for user", () => {
      let db = new PlaylistDal();
      let plist = db.getPlaylistsByUser("1", false);

      chai.assert(plist, "retrieved song list is undefined");
      chai.assert(plist.length > 0, "no items in playlist");
    });

    it("deletes a Playlist", () => {
      let db = new PlaylistDal();
      let count = db.count();
      db.delPlaylist("1", "1");
      chai.assert(db.count() === count - 1, "deletion did not succeed");
    });

    it("adds a Playlist", () => {
      let db = new PlaylistDal();
      let count = db.count();
      let list = new Playlist("testlist1", "1");

      let newId = db.addNewPlaylist(list);
      chai.assert(db.count() === count + 1, "adding a new playlist did not succeed");
      let newList = db.getPlaylistById(newId);
      chai.assert(newList, "newly added list cant be found in DB");
    });

    it("adds an item to list", () => {
      let db = new PlaylistDal();

      let initialLen = db.getPlaylistById("1").songIds.length;
      db.addItemToPlaylist("1", "1", "3");
      let newLen = db.getPlaylistById("1").songIds.length;
      db.removeItemFromPlaylist("1", "1", "3");
      chai.assert(newLen === initialLen + 1, "insert did not succeed");
    });

    it("deletes a list item", () => {
      let db = new PlaylistDal();
      db.addItemToPlaylist("1", "1", "3");
      let initialLen = db.getPlaylistById("1").songIds.length;
      db.removeItemFromPlaylist("1", "1", "3");
      let newLen = db.getPlaylistById("1").songIds.length;

      chai.assert(newLen === initialLen - 1, "deletion did not succeed");
    });

  });

});
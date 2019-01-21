import request = require("request");
import chai = require("chai");
import { Playlist } from "../src/types/playlist";
const baseUrl = "http://localhost:3002/";

describe("Playlist Server", () => {
  describe("playlist API", () => {
    it("GET playlist by id", (done) => {
      request.get(baseUrl + "v1/playlists?id=2", (error, response, body) => {
        chai.assert(response, "no response recieved!");
        chai.assert(response.statusCode === 200, "error in status code");
        done();
      });
    });

    it("deletes a playlist", (done) => {
      request.delete(baseUrl + "v1/playlists?id=3", (error, response, body) => {
        chai.assert(response, "no response recieved!");
        chai.assert(response.statusCode === 200, "error in status code");
        done();
      });
    });
    it("adds a song to playlist", (done) => {

      request.post({
        headers: { "content-type": "application/json" },
        url: baseUrl + "v1/playlists/1?songId=3",
      }, (error, response, body) => {
        chai.assert(response, "no response recieved!");
        chai.assert(response.statusCode === 200, "error in status code");

        request.delete({
          headers: { "content-type": "application/json" },
          url: baseUrl + "v1/playlists/1?songId=3",
        }, () => {
          done();
        });
      });
    });

    it("removes a song from playlist", (done) => {
      request.post({
        headers: { "content-type": "application/json" },
        url: baseUrl + "v1/playlists/1?songId=3",
      }, () => {
        request.delete({
          headers: { "content-type": "application/json" },
          url: baseUrl + "v1/playlists/1?songId=3",
        }, (error, response, body) => {
          chai.assert(response, "no response recieved!");
          chai.assert(response.statusCode === 200, "error in status code");
          done();
        });
      });

    });

    it("adds a playlist", (done) => {
      let plist: Playlist = {
        id: "",
        name: "stam1",
        songIds: null,
        creationTime: null,
        lastModifiedTime: null,
        creatorId: "me",
        isPublic: true,
        playedCounter: 0,
      };

      request.post({
        headers: { "content-type": "application/json" },
        url: baseUrl + "v1/playlists",
        body: JSON.stringify(plist),
      }, (error, response, body) => {
        chai.assert(response, "no response recieved!");
        chai.assert(response.statusCode === 200, "error in status code");
        let newId = (body);
        chai.assert(newId, "no item id returned!");
        done();
      });
    });
  });

});
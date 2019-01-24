import request = require("request");
import chai = require("chai");

const baseUrl = "http://localhost:3002/";

describe("Playlist Server", () => {
  describe("GET playlist by id", () => {
    it("returns status code 200", (done) => {
      request.get(baseUrl + "playlists?id=2", (error, response, body) => {
        chai.assert(response, "no response recieved!");
        chai.assert(response.statusCode === 200, "error in status code");
        done();
      });
    });
  });
});
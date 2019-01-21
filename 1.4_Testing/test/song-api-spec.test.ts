import request = require("request");
import chai = require("chai");

const baseUrl = "http://localhost:3000/";

describe("Songs Server", () => {
  describe("GET a song by ID", () => {

    it("returns status code 200", (done) => {
      request.get(baseUrl + "v1/songs?id=2", (error, response, body) => {
        chai.assert(response, "no response recieved!");
        chai.assert(response.statusCode === 200, "error in status code");
        done();
      });
      
    });
  });
});
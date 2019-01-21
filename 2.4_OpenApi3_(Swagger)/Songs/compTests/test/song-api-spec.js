var request = require("request");
var base_url = "http://localhost:3000/";
describe("Hello World Server", function () {
    describe("GET /song?id=2", function () {
        it("returns status code 200", function (done) {
            request.get(base_url + "song?id=2", function (error, response, body) {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });
});

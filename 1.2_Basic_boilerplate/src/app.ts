
import * as fs from "fs";
import * as util from "util";
import * as url from "url";
import * as http from "http";
import { Logger } from "./logger";
import { IConfiguration } from "./types/config";

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);

// getting the configuration from file for now
async function getConfig() {
    let content = await readFile("./config.json", "utf8");
    return JSON.parse(content) as IConfiguration;
}

async function main() {
    let conf = await getConfig();

    // can use winston or bunyan in real applications (coloring & format)
    let logger = new Logger(conf.logLevel);

    logger.info("running with configuration: ", JSON.stringify(conf));

    // create a server object:
    http.createServer((req, res) => {
        let purl = url.parse(req.url, true);
        if (purl.pathname === "/hello" && req.method === "GET") {
            res.write("Hello World!"); // write a response to the client
            res.end(); // end the response
            return;
        }
        res.writeHead(404);
        res.end();
    }).listen(3000); // run the server object listener
}
main();
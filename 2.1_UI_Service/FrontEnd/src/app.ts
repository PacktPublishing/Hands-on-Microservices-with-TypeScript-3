
import { Logger } from "./logger";
import express = require("express");

function main(): void {
    let app: express.Express = express();
    let logger = new Logger("info");

    app.use(express.static("public"));
    app.listen(3001, () => {
        logger.info("Service listening on port 3001!");
    });
}

main();


import * as util from "util";
import * as Redis from "redis";
import { Logger } from "../logger";

export class DalRedis {
    public async getAsync(key: string) { return null; }
    public async setAsync(key: string, value: string) { return null; }

    private client: Redis.RedisClient;

    constructor(logger: Logger, host: string, port: number) {
        let client = Redis.createClient(port, host, null);
        // if you'd like to select database 3, instead of 0 (default), call
        // client.select(3, function() { /* ... */ });

        client.on("error", (err) => {
            logger.error("Error in redis data layer: ", err);
        });

        client.set("mykey", "a-String");
        // client.hset("hash key", "hashtest 1", "some value", Redis.print);
        // client.hset("hash key", "hashtest 2", "some other value", Redis.print);
        // client.hkeys("hash key", (err, replies) => {
        //     console.log(replies.length + " replies:");
        //     replies.forEach((reply, i) => {
        //         console.log("    " + i + ": " + reply);
        //     });
        //     client.quit();
        // });

        this.getAsync = util.promisify(client.get).bind(client);
        this.setAsync = util.promisify(client.set).bind(client);
    }
}

import { EventEmitter } from "events";
import { LogLevelEnum } from "../logger";

export class ServiceConfig extends EventEmitter {
    public logLevel: LogLevelEnum;

    public configurationChanged() {
        this.emit("changed");
    }
}
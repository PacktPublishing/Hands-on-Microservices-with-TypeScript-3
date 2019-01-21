"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    getDate() {
        let date = new Date();
        let dStr = date.toLocaleDateString() + " " + date.toLocaleTimeString();
        return dStr;
    }
    debug(fmt, ...additions) {
        console.debug(this.getDate() + " [Debug] " + fmt, ...additions);
    }
    info(fmt, ...additions) {
        console.info(this.getDate() + " [Info] " + fmt, ...additions);
    }
    warn(fmt, ...additions) {
        console.warn(this.getDate() + " [Warn ] " + fmt, ...additions);
    }
    error(fmt, ...additions) {
        console.error(this.getDate() + " [Error] " + fmt, ...additions);
    }
}
exports.Logger = Logger;

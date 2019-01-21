import { Etcd3 } from "etcd3";
import { Logger, LogLevelEnum } from "../logger";
import { ServiceConfig } from "./service-config";

export class Etcd {
    private client: Etcd3;
    constructor(etcdHostAddress: string) {
        this.client = new Etcd3({
            hosts: etcdHostAddress,
        });
    }
    public async getConfig(): Promise<ServiceConfig> {
        let scfg = new ServiceConfig();
        let logLvl = await this.client.get("loglevel").string();
        scfg.logLevel = this.getLogLevelEnumVal(logLvl);
        return scfg;
    }

    public async setLogLevel(newLevel: string) {
        await this.client.put("loglevel").value(newLevel).exec();
    }

    public async populate() {
        // log level is initially info
        await this.client.put("loglevel").value("info").exec();
    }

    public async setWatchers(config: ServiceConfig) {
        // let lvlVal = await this.client.get("loglevel").string();
        // logger.logLevel = lvlVal;
        // logger.info("loglevel:", lvlVal);

        let watcher = await this.client.watch()
            .key("loglevel")
            .create();

        watcher
            .on("disconnected", () => console.log("disconnected..."))
            .on("connected", () => console.log("successfully reconnected!"))
            .on("put",
                (res) => {
                    let newLogLevel = res.value.toString();
                    console.log("loglevel got set to:", newLogLevel);
                    config.logLevel = this.getLogLevelEnumVal(newLogLevel);
                    config.configurationChanged();
                });
    }

    private getLogLevelEnumVal(newLogLevel: string): LogLevelEnum {
        let logLevel = LogLevelEnum[newLogLevel];
        // for (let k in LogLevelEnum) {
        //     if (LogLevelEnum[k] === newLogLevel) {
        //         logLevel = Number(k);
        //     }
        // }
        return logLevel;
    }
}

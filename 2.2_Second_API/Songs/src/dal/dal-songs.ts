import { ISong } from "../types/song";
import * as fs from "fs";
export class SongDal {
    public map: Map<string, ISong> = new Map<string, ISong>();
    constructor() {
        let contents: any = fs.readFileSync("songs.json");
        let obj = JSON.parse(contents);
        obj.forEach((item) => {
            this.map[item.id + ""] = item;
        });
     }

    public getSongSearch(q: string): ISong[] {
        let retList: ISong[] = [];
        for (let key in this.map) {
            let item = this.map[key];
            item.fullName = item.name + " - " + item.artist;
            if (item.fullName.toLowerCase().includes(q.toLowerCase())) {
                retList.push(item);
            }
        }
        return retList;
    }

    public getSongById(id: string): ISong {
        return this.map[id];
    }
}

import { ISong } from "../types/song";
import * as fs from "fs";
export class SongDal {
    public map: Map<string, ISong> = new Map<string, ISong>();
    constructor() {
      let contents: any = fs.readFileSync("songs.json");
        let obj = JSON.parse(contents);
        obj.forEach(item => {
            this.map[item.id+""] = item;
        });
    }
    public getSongById(id: string): ISong {
        return this.map[id];
    }
}

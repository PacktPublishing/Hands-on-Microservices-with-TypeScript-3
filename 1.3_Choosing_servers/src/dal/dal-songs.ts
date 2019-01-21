import {ISong} from "../types/song";

export class SongDal {
    public map: Map<string, ISong> = new Map<string, ISong>();
    constructor() {
        this.map["1"] = { id: 1, name: "Ironic", playtimeSecs: 189, link: "/songs/Ironic.mp3", artist: "Alanis" };
        this.map["2"] = { id: 2, name: "Alehandro", playtimeSecs: 211, link: "/songs/Alehandro.mp3", artist: "Lady Gaga" };
        this.map["3"] = { id: 3, name: "Lithium", playtimeSecs: 173, link: "/songs/Lithium.mp3", artist: "Nirvana" };
    }

    public getSongById(id: string): ISong {
        return this.map[id];
    }
}

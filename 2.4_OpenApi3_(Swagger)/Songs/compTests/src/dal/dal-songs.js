"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SongDal {
    constructor() {
        this.map = new Map();
        this.map["1"] = { id: 1, name: "Ironic", playtimeSecs: 189, link: "/songs/Ironic.mp3", artist: "Alanis" };
        this.map["2"] = { id: 2, name: "Alehandro", playtimeSecs: 211, link: "/songs/Alehandro.mp3", artist: "Lady Gaga" };
        this.map["3"] = { id: 3, name: "Lithium", playtimeSecs: 173, link: "/songs/Lithium.mp3", artist: "Nirvana" };
    }
    getSongById(id) {
        return this.map[id];
    }
}
exports.SongDal = SongDal;

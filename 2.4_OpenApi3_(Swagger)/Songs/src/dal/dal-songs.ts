import { ISong } from "../types/song";

export class SongDal {
    public map: Map<string, ISong> = new Map<string, ISong>();
    constructor() {
        this.map["1"] = {
            id: 1, name: "Ironic", playtimeSecs: 189, link: "/storage/songs/Ironic.mp3",
            releaseDate: "2016-08-29T09:12:33.001Z",
            playCount: 2358293,
            artist: {
                name: "Alanis",
                homePage: "https://www.alanismorisette.com/",
            },
        };

        this.map["2"] = {
            id: 2, name: "Alehandro", playtimeSecs: 211, link: "/storage/songs/Alehandro.mp3",
            releaseDate: "2016-08-29T09:12:33.001Z",
            playCount: 1358293,
            artist: {
                name: "Lady Gaga",
                homePage: "https://www.ladygaga.com/",
            },
        };

        this.map["3"] = {
            id: 3, name: "Lithium", playtimeSecs: 173, link: "/storage/songs/Lithium.mp3",
            releaseDate: "2016-08-29T09:12:33.001Z",
            playCount: 12383493,
            artist: {
                name: "Nirvana",
                homePage: "https://www.nirvana.com/",
            },
        };
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

export interface ISongDesc {
    id: string;
}
export class Playlist {
    public id: string;
    public name: string;
    public songIds: string[];
    public creationTime: Date;
    public lastModifiedTime: Date;
    public creatorId: string;
    public isPublic: boolean;
    public playedCounter: number;
    constructor(lname: string, lcreatorId: string) {

        let list: Playlist = {
            id: "",
            name: lname,
            songIds: [],
            creationTime: new Date(),
            lastModifiedTime: new Date(),
            creatorId: lcreatorId,
            isPublic: false,
            playedCounter: 0,
        };
        return list;
    }
}
import { Playlist, ISongDesc } from "../types/playlist";

export class PlaylistDal {
    public map: Map<string, Playlist> = new Map<string, Playlist>();

    constructor() {
        this.map["1"] = {
            id: "1",
            name: "PopHits2000",
            songIds: ["111"],
            creationTime: Date.parse("21-07-2011T11:48:33"),
            lastModifiedTime: Date.parse("21-07-2011T11:48:33"),
            creatorId: "1",
            isPublic: true,
            playedCounter: 21,
        };
        this.map["2"] = {
            id: "2",
            name: "User1-Hits2001",
            songIds: [],
            creationTime: Date.parse("21-07-2011T11:48:33"),
            lastModifiedTime: Date.parse("21-07-2011T11:48:33"),
            creatorId: "1",
            isPublic: false,
            playedCounter: 21,
        };

        this.map["3"] = {
            id: "3",
            name: "User2-Hits2002",
            songIds: [],
            creationTime: Date.parse("21-07-2011T11:48:33"),
            lastModifiedTime: Date.parse("21-07-2011T11:48:33"),
            creatorId: "2",
            isPublic: false,
            playedCounter: 21,
        };
    }

    public getPlaylistById(id: string): Playlist {
        return this.map[id];
    }

    public getPlaylistsByUser(uid: string, onlyOwned: boolean): Playlist[] {
        let retList: Playlist[] = [];
        for (let key in this.map) {
            let plist = this.map[key];
            if (plist.creatorId === uid || (plist.isPublic && !onlyOwned)) {
                retList.push(plist);
            }
        }
        return retList;
    }

    public addNewPlaylist(listItem: Playlist): string {
        let newListId = "" + (this.count() + 1);
        listItem.id = newListId;
        listItem.songIds = [];
        this.map[newListId] = listItem;
        return newListId;
    }

    private hasAccess(listId: string, userId: string): boolean {
        let list: Playlist = this.map[listId];
        return list.creatorId === userId;
    }
    public addItemToPlaylist(currentUserId: string, listId: string, songId: string): Error {
        if (!this.map[listId]) {
            return new Error("Playlist not found");
        }
        if (!this.hasAccess(listId, currentUserId)) {
            return new Error("User not authorized to change the playlist");
        }
        this.map[listId].songIds.push(songId);
    }

    public removeItemFromPlaylist(currentUserId: string, listId: string, songId: string): Error {
        if (!this.map[listId]) {
            return new Error("Playlist not found");
        }
        if (!this.hasAccess(listId, currentUserId)) {
            return new Error("User not authorized to change the playlist");
        }
        let plist: Playlist = this.map[listId];
        let array = plist.songIds;
        let index = array.indexOf(songId);
        if (index > -1) {
            array.splice(index, 1);
        }
        this.map[listId].songIds = array;
    }

    public delPlaylist(currentUserId: string, listId: string): Error {
        if (!this.map[listId]) {
            return new Error("Playlist not found");
        }
        if (!this.hasAccess(listId, currentUserId)) {
            return new Error("User not authorized to change the playlist");
        }
        delete this.map[listId];
    }

    public count(): number {
        return Object.keys(this.map).length;
    }
}
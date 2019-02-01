<template>
  <div class="songs">
    <div class="d-flex flex-row centered">
      <img class="p-2" src="../assets/musical-note.png" style="height: 64px;width: 64px;">
      <h1 class="p-2">Playlists Manager</h1>
    </div>
    <div>
      <b-container class="bv-example-row">
        <div class="d-flex flex-row">
          <div class="p-2 bold">Add List:</div>
          <div class="p-2">
            <b-textarea v-model="newPlaylistName"></b-textarea>
          </div>
          <div class="p-2">
            <b-button
              variant="primary"
              class="float-sm-right"
              v-on:click="addPlaylist(newPlaylistName,'2',true)"
            >Add List</b-button>
          </div>
        </div>
        <div class="d-flex flex-row">
          <div class="p-2 bold">Pick song:</div>
          <div class="p-2">
            <!-- clear-button-icon="clear-icon" -->
            <autocomplete
              input-class="form-control"
              source="http://localhost:3080/api/songSvc/v1/songs?q="
              results-display="fullName"
              clear-button-icon="clear-icon"
              v-model="selectedSong"
            ></autocomplete>
          </div>
          <div class="p-2">
            <b-form-select v-model="selectedPlaylist" :options="playlists" class="mb-3"/>
          </div>
          <div class="p-2">
            <b-button
              variant="primary"
              class="float-sm-right"
              v-on:click="addSongToList(selectedSong,selectedPlaylist)"
            >Add song</b-button>
          </div>
        </div>
        <b-row>
          <b-col v-for="plist in playlists" :key="plist.id" class="col-4">
            <b-card
              bg-variant="primary"
              text-variant="white"
              v-bind:header="plist.name"
              class="text-center my-3 rounded-card"
            >
              <div class="card-text capsule text-left" v-for="song in plist.songs" :key="song.id">
                {{song.name}} / {{song.artist}}
                <img
                  alt="Delete"
                  class="float-right del-icon clickable"
                  src="../assets/delb16.png"
                  @click="removeSongFromList(song.id,plist.id)"
                >
              </div>

              <b-button
                variant="danger"
                class="float-sm-right"
                v-on:click="delPlaylist(plist.id)"
              >Delete List</b-button>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import * as request from "request";
// @ts-ignore
import * as Autocomplete from "vuejs-auto-complete";
import { setTimeout } from "timers";

interface ISong {
  name: string;
  artist: string;
  id: string;
}
import { promisify } from "util";
Vue.use(BootstrapVue);
@Component({
  components: {
    Autocomplete
  }
})
export default class Songs extends Vue {
  public playlists: any[] = [];
  public newPlaylistName: string = "";
  public selectedPlaylist = null;
  public selectedSong: string = "";
  public songs: { [id: string]: ISong } = {};
  private playlistApiBase: string = "http://localhost:3080/api/listSvc/";
  private songsApiBase: string = "http://localhost:3080/api/songSvc/";

  public updateUserLists(): Promise<Error> {
    return new Promise((resolve, reject) => {
      let that = this;
      request.get(
        this.playlistApiBase + "v1/playlists?userId=2",
        (err, response, body) => {
          if (err) {
            reject(err);
          } else {
            const obj = JSON.parse(body);
            this.playlists = obj;
            for (let plist of this.playlists) {
              plist.text = plist.name;
              plist.value = plist.id;

              let lsongs = [];
              for (let songId of plist.songIds) {
                let song = that.songs[songId];
                if (song && song.id) {
                  lsongs.push(song);
                }
              }
              plist.songs = lsongs;
            }
            resolve(undefined);
          }
        }
      );
    });
  }

  public updateSongList(): Promise<Error> {
    return new Promise((resolve, reject) => {
      request.get(this.songsApiBase + "v1/songs", (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          const obj = JSON.parse(body);
          for (let song of obj) {
            this.songs[song.id] = song;
          }
          resolve(undefined);
        }
      });
    });
  }

  public addSongToList(songId: string, listId: string) {
    let that = this;
    request.post(
      {
        headers: { "content-type": "application/json" },
        url:
          this.playlistApiBase + "v1/playlists/" + listId + "?songId=" + songId
      },
      (error, response, body) => {
        if (response.statusCode > 200) {
          alert(body);
        }
        that.updateUserLists();
      }
    );
  }
  public removeSongFromList(songId: string, listId: string) {
    let that = this;
    request.delete(
      {
        headers: { "content-type": "application/json" },
        url:
          this.playlistApiBase + "v1/playlists/" + listId + "?songId=" + songId
      },
      (error, response, body) => {
        if (response.statusCode > 200) {
          alert(body);
        }
        that.updateUserLists();
      }
    );
  }
  public delPlaylist(listId: string) {
    let that = this;
    request.delete(
      this.playlistApiBase + "v1/playlists?id=" + listId,
      (error, response, body) => {
        if (response.statusCode > 200) {
          alert(body);
        }
        that.updateUserLists();
      }
    );
  }

  public addPlaylist(listName: string, creatorUserId: string, isPub: boolean) {
    const plist = {
      id: "",
      text: "",
      name: listName,
      songIds: [],
      creationTime: new Date(),
      lastModifiedTime: new Date(),
      creatorId: creatorUserId,
      isPublic: isPub,
      playedCounter: 0
    };
    let that = this;
    request.post(
      {
        headers: { "content-type": "application/json" },
        url: this.playlistApiBase + "v1/playlists",
        body: JSON.stringify(plist)
      },
      (error, response, body) => {
        const newId = body;
        plist.id = newId;
        plist.text = plist.name;
        that.playlists.push(plist);
        that.updateUserLists();
      }
    );
  }

  public async mounted() {
    await this.updateSongList();
    await this.updateUserLists();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.del-icon {
  padding: 4px;
}

.clickable {
  cursor: pointer;
}
.centered {
  display: flex;
  align-items: center;
  justify-content: center;
}
.rounded-card {
  border-radius: 20px;
  background-image: linear-gradient(
    to bottom right,
    rgb(86, 149, 160),
    rgb(106, 103, 150)
  );
}
.bold {
  width: 130px;
  font-weight: 800;
  font-size: 20px;
  text-align: left;
}
.clear-icon {
  float: right;
  width: 15px;
  height: 15px;
  margin: -0px;
  background-image: url("../assets/backspace16.png");
}
.capsule {
  border-radius: 20px;
  color: #2a2a3a;
  background-image: linear-gradient(
    to bottom right,
    rgb(86, 86, 160),
    rgb(213, 215, 224)
  );
  background-color: #c5c0e4;
  border: 1px solid rgb(95, 95, 133);
  font-weight: 800;
  text-indent: 2%;
  margin: 15px, 5px, 10px, 20px;
  padding: 15px, 10px;
  text-align: center;
}
</style>

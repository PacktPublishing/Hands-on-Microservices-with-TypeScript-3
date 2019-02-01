<template>
  <div class="login">
    <h1>Login with google</h1>
    <!-- <b-button variant="primary" v-on:click="navigateToLogin()">Add song</b-button> -->
    <!-- <b-link href="http://localhost:3080/api/authSvc/google">
      <img src="../assets/googleButton.png" width="200" height="50">
    </b-link>-->
    <b-link href="http://localhost:3080/api/authSvc/auth/google">
      <img src="../assets/googleButton.png" width="200" height="50">
    </b-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class About extends Vue {
}
</script>
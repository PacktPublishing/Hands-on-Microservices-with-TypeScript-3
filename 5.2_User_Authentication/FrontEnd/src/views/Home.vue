<template>
  <div class="home">
    <Songs msg=""/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Songs from "@/components/Songs.vue"; // @ is an alias to /src

@Component({
  components: {
    Songs,
  }
})
export default class Home extends Vue {}
</script>

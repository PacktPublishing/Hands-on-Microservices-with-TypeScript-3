<template>
  <div class="home">
    <H2>Hello {{userName}} !</H2>
    <Songs msg=""/>
   
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Songs from "@/components/Songs.vue"; // @ is an alias to /src

@Component({
  components: {
    Songs,
  }
})
export default class Home extends Vue {
   @Prop() private userId!: string;
   @Prop() private userName!: string;
}
</script>

<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <StarredRepos msg="My Starred Repos" />
  </div>
</template>

<script>
// @ is an alias to /src
import StarredRepos from "@/components/StarredRepos.vue";

export default {
  name: "home",
  components: {
    StarredRepos
  }
};
</script>

<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div>{{ username }}</div>
    <button @click="myStarredRepos">Get Starred Repos</button>
    <table class="table table-striped" v-if="starredRepos.length > 0">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Stars</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="repo in starredRepos" :key="repo.html_url">
          <th scope="row"><a :href="repo.html_url">{{repo.full_name}}</a></th>
          <td>{{repo.description}}</td>
          <td>{{repo.stargazers_count}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "home",
  data() {
    return {
      //profile data
      username: '', 
      avatar_url: '', 
      profile_url: '', 
      type: '',
      //profile starred repos list
      starredRepos: []
    };
  },
  created() {
    //on load get logged-in user data from localstorage
    const user = JSON.parse(localStorage.getItem('user'));
    this.username = user.username;
    this.avatar_url = user.avatar_url;
    this.profile_url = user.profile_url;
    this.type = user.type;
  },
  methods: {
    myStarredRepos() {
      axios.get("/api/profile/repos").then(response => {
        const { repos } = response.data;
        this.starredRepos = repos;
      });
    }
  }
};
</script>

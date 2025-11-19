<script>
import PostBox from '@/components/PostBox.vue'
import axios from 'axios'

export default {
  components: { PostBox },
  data() {
    return {
      posts: [],
      me:'',
    }
  },
  methods: {
    async fetchMyPosts() {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:3000/post/?u=${this.me.username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.posts = response.data
      for (const post of this.posts) {
        const plays = await axios.get(`http://localhost:3000/post/${post.id_post}/play/?u=${this.me.username}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        post.isPlayed = plays.data.played
        post.plays = plays.data.amount
        console.log(this.id)
      }
    },
    async getMe(){
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.me = response.data
    }
  },
  async mounted() {
    await this.getMe();
    await this.fetchMyPosts();
  },
}
</script>

<template>
<div id="profilPage">
  <div class="mainComponent">
    <h2 class="title1">Profil</h2>
  </div>
  <div id="myPosts" class="mainComponent">
    <h2 class="title1">My Posts</h2>
    <div id="myPostsContainer">
      <div class="post" v-for="post in this.posts">
        <PostBox
          :post="post"
        />
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
*{
  box-sizing: border-box;
}
#profilPage {
  display: flex;
  width: 100%;
  gap: var(--spacing-lg);
}
#myPosts {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-height: 620px;
}
#myPostsContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  overflow-y: auto;
}
</style>
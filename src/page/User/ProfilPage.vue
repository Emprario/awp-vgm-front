<script>
import PostBox from '@/components/Posts/PostBox.vue'
import PostCreation from '@/components/Posts/postCreationComponent.vue'
import axios from 'axios'

export default {
  components: { PostBox, PostCreation },
  data() {
    return {
      posts: [],
      me:'',
      selectedPost: null,
      lastsScores: [],
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
        await this.getSignals(post)
      }
    },
    async getSignals(post){
      const token = localStorage.getItem('token')
      const signals = await axios.get(`http://localhost:3000/post/${post.id_post}/signal`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      post.isSignaled = signals.data.signaled
      post.signals = signals.data.amount
    },
    async getMe(){
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.me = response.data
    },
    async delPost(){
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3000/post/${this.selectedPost.id_post}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.selectedPost = null;
      await this.fetchMyPosts()
    },
    async updatePost(){
      if (this.selectedPost.vgd.length === 0) {
        alert("You must put at least one Video Game's tag")
        return
      }
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:3000/post/${this.selectedPost.id_post}`, this.selectedPost, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await this.fetchMyPosts()
      this.selectedPost = null;
    },
    selectPost(post){
      if (this.selectedPost === post) {
        this.selectedPost = null;
      }
      else {
        this.selectedPost = post;
      }
    },
    async logOut(){
      localStorage.removeItem('token')
      this.me = null
      this.posts = []
      this.selectedPost = null
      this.$router.push('/login')
    },
    async getLastsScores(){
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/session', {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.lastsScores = response.data
    }
  },
  async mounted() {
    await this.getMe();
    await this.fetchMyPosts();
    await this.getLastsScores();
  },
}
</script>

<template>
<div id="profilPage">
  <!-- GENERAL INFOS -->
  <div id="myGlobalInfos" class="mainComponent" v-if="!selectedPost">
    <div id="myInfos">
      <h2 class="title1">Profile</h2>
      <div id="infosGen">
        <p class="title2">Username</p>
        <p class="post">{{this.me.username}}</p>
        <p class="title2">Email</p>
        <p class="post">{{this.me.mail}}</p>
        <button class="typeDelete" @click="logOut">LogOut</button>
      </div>
    </div>
    <div id="myScores">
      <h2 class="title2">My lasts scores :</h2>
      <div class="scoreContainer">
        <div class="score myScore" v-for="(score, index) in lastsScores">
          <p></p>
          <p>{{score.score}}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- UPDATE A POST -->
  <div id="updatePost" class="mainComponent" v-if="selectedPost">
    <div id="topUpdatePost">
      <h2 class="title1">Update Post</h2>
      <PostCreation
        :post="this.selectedPost"
      />
    </div>
    <div id="updatePostButtons">
      <button class="typeSubmit" @click="updatePost">Update Post</button>
      <button class="typeDelete" @click="delPost">Delete Post</button>
    </div>
  </div>

  <!-- DISPLAY MY POSTS -->
  <div id="myPosts" class="mainComponent">
    <h2 class="title1">My Posts</h2>
    <div id="myPostsContainer">
      <div @click="selectPost(post)" id="myPost" v-for="post in this.posts">
        <div class="post">
          <PostBox
            :post="post"
          />
        </div>
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

/* ===== MY POSTS ===== */
#myPosts {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-height: 620px;
  height: 100%;
}
#myPostsContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  overflow-y: auto;
}
#myPost {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-xs);
}
#myPost div {
  width: 100%;
}
#myPost:hover {
  transform: scale(0.995);
  transition: var(--transition-slow);
}

/* ===== UPDATE ===== */
#updatePost {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  justify-content: space-between;
}
#topUpdatePost {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}
#updatePostButtons {
  display: flex;
  gap: var(--spacing-xs);
  width: 100%;
}
#updatePostButtons button {
  width: 100%;
}

/* ===== MY INFOS ===== */
#myGlobalInfos {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
#myInfos {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}
#infosGen {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
#infosGen p{
  margin: 0;
}
#myScores {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  #profilPage {
    flex-direction: column;
  }
}
</style>
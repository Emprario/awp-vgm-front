<script>
import PostBox from '@/components/PostBox.vue'
import PostCreation from '@/components/postCreationComponent.vue'
import axios from 'axios'

export default {
  components: { PostBox, PostCreation },
  data() {
    return {
      posts: [],
      me:'',
      selectedPost: null,
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
  },
  async mounted() {
    await this.getMe();
    await this.fetchMyPosts();
  },
}
</script>

<template>
<div id="profilPage">
  <div class="mainComponent" v-if="!selectedPost">
    <h2 class="title1">Profil</h2>
  </div>
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
#myPost {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-xs);
}
#myPost div {
  width: 100%;
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

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  #profilPage {
    flex-direction: column;
  }
}
</style>
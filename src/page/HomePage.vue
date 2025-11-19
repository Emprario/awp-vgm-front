<script>
import axios from 'axios'
import { useRoute } from 'vue-router'
import FloatingButton from '@/components/FloatingButton.vue'
import QuestionComponent from '@/components/QuestionComponent.vue'
import PostBox from '@/components/PostBox.vue'
import AnswerComponent from '@/components/AnswerComponent.vue'

export default {
  components: { AnswerComponent, FloatingButton, QuestionComponent, PostBox },
  props: {
    id: String,
    vgs: Object,
  },

  data() {
    return {
      // Posts
      posts: [],

      // VGs
      listVg : [],

      // New Post
      newQcm: [
        {
          id_qset: '',
          prompt: '',
          ressource_type: '',
          ressource_link: '',
          questionArray: [
            {
              id_question: '',
              is_correct: false,
              statement: '',
            },
          ],
        },
      ],
      newPost: {
        id_post: '',
        title: '',
        content: '',
        plays: 0,
        isPlayed: false,
        publish_date: '',
        publisher: '',
        qsetArray: '',
        vgd: [],
      },

      // UI States
      isAnswering: false,
      isCreatingPost: false,
      selectedPost: null,
      selectedQCM: null,
      selectedAnswer: null,
    }
  },
  methods: {
    async fetchPosts() {
      console.log(this.id)
      var response;
      const token = localStorage.getItem('token')
      if (this.id === "0"){
        response = await axios.get('http://localhost:3000/post', {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      else {
        response = await axios.get(`http://localhost:3000/post/?gs=${this.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      this.posts = response.data
      for (const post of this.posts) {
        const plays = await axios.get(`http://localhost:3000/post/${post.id_post}/play`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        post.isPlayed = plays.data.played
        post.plays = plays.data.amount
        console.log(this.id)
      }
    },
    async fetchVGs() {
      const token = localStorage.getItem('token')
      const VGS = await axios.get('http://localhost:3000/vgd', {
        headers: { Authorization: `Bearer ${token}` }
      })

      this.listVg = VGS.data;
    },
    async addPost() {
      const token = localStorage.getItem('token')
      this.newPost.qsetArray = this.newQcm

      await axios.post('http://localhost:3000/post', this.newPost, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("azi requete de merde la")
      this.newPost = {
        id_post: '',
        title: '',
        content: '',
        plays: 0,
        qsetArray: '',
        vgd: [],
      }
      this.newQcm = [
        {
          id_qset: '',
          prompt: '',
          ressource_type: '',
          ressource_link: '',
          questionArray: [
            {
              id_question: '',
              is_correct: '',
              statement: '',
            },
          ],
        },
      ]

      await this.fetchPosts();
      for (const post of this.posts) {
        const plays = await axios.get(`http://localhost:3000/post/${post.id_post}/play`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        post.isPlayed = plays.data.isPlayed
        post.plays = plays.data.amount
      }
    },
    async addAnswer() {
      console.log(this.newPost.content)
      const token = localStorage.getItem('token')
      await axios.post(
        `http://localhost:3000/post/${this.selectedPost.id_post}/reply`,
        { content: this.newPost.content },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      this.newPost.content = ''
      this.selectPost(this.selectedPost)
    },
    toggleIsAnswering() {
      console.log('toggleIsAnswering')
      this.isAnswering = !this.isAnswering
    },
    async toggleIsCreatingPost() {
      await this.fetchVGs();
      this.isCreatingPost = !this.isCreatingPost
    },
    async togglePlays(post) {
      const token = localStorage.getItem('token')
      const plays = await axios.get(`http://localhost:3000/post/${post.id_post}/play`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      post.isPlayed = plays.data.played
      if (post.isPlayed) {
        await axios.delete(`http://localhost:3000/post/${post.id_post}/play`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        post.isPlayed = false
      } else {
        await axios.post(`http://localhost:3000/post/${post.id_post}/play`, '', {
          headers: { Authorization: `Bearer ${token}` },
        })
        post.isPlayed = true
      }
      const playsUpdate = await axios.get(`http://localhost:3000/post/${post.id_post}/play`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      post.plays = playsUpdate.data.amount
    },
    async selectPost(post) {
      console.log(post)
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:3000/post/${post.id_post}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const plays = await axios.get(`http://localhost:3000/post/${post.id_post}/play`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log(response)
      this.selectedPost = response.data.post
      this.selectedAnswer = response.data.replies
      this.selectedQCM = response.data.qset
      this.isAnswering = true
      this.selectedPost.plays = plays.data.amount
      this.selectedPost.isPlayed = plays.data.played
    },
    toggleInSelectedVGs(vg) {
      const index = this.newPost.vgd.indexOf(vg.id_vg);

      if (index !== -1) {
        // déjà dedans → enlever
        this.newPost.vgd.splice(index, 1);
      } else {
        // pas dedans → ajouter
        this.newPost.vgd.push(vg.id_vg);
      }
    },
    isInSelectedVGs(vg) {
      return this.newPost.vgd.indexOf(vg.id_vg) !== -1;
    },
    addQuestion() {
      this.newQcm.push({
        id_question: '',
        statement: '',
        questionArray: [],
      })
    },
    removeQuestion(index) {
      this.newQcm.splice(index, 1)
    },
  },
  async mounted() {
    const token = localStorage.getItem('token')
    await this.fetchVGs();
    await this.fetchPosts();

  },
  watch: {
    id: {
      immediate: true, // optionnel si tu veux relancer aussi au montage
      handler(newId, oldId) {
        this.fetchPosts()
      }
    }
  }
}
</script>

<template>
  <div id="homePage">
    <!-- GET ALL POSTS -->
    <div id="postsContainer" class="mainComponent" v-if="!isCreatingPost & !isAnswering">
      <FloatingButton class="typeSubmit" @click="toggleIsCreatingPost">+</FloatingButton>
      <div class="post" v-for="post in posts" @click="selectPost(post)">
        <PostBox
          :post="post"
          @togglePlays="togglePlays(post)"
        />
      </div>
    </div>

    <!-- REPLY -->
    <div id="answersContainer" class="mainComponent" v-if="!isCreatingPost && isAnswering">
      <div class="post">
        <PostBox
          :post="selectedPost"
          @togglePlays="togglePlays(selectedPost)"
        />
      </div>
      <button class="typeSubmit">Do the QCM</button>
      <div id="answersPost">
        <p class="textLabel">Comments :</p>
        <div class="post" v-for="answer in selectedAnswer">
          <p>{{ answer.post.content }}</p>
        </div>
      </div>
    </div>
    <div id="answerBar" class="mainComponent" v-if="isAnswering & !isCreatingPost">
      <form class="mainSearchZone" @submit.prevent="addAnswer">
        <label>Reply :</label>
        <input class="searchTextZone" v-model="newPost.content" />
        <button class="typeSubmit">Reply</button>
      </form>
    </div>

    <!-- ADD POST -->
    <div id="newPost" v-if="isCreatingPost">
      <div id="creationPost" class="mainComponent">
        <FloatingButton class="typeSubmit" @click="toggleIsCreatingPost">-</FloatingButton>
        <!-- General informations -->
        <div id="labelPostForm">
          <label class="title1">Title</label>
          <input type="text" class="normalInputText" v-model="newPost.title" />

          <label class="title1">Content</label>
          <input type="text" class="normalInputText" v-model="newPost.content" />
        </div>
        <!-- VGs selection -->
        <div id="VGsDisplay">
          <div v-for="vg in this.listVg">
            <div class="VG"
                 @click="toggleInSelectedVGs(vg)"
                 :class="{ selected: this.isInSelectedVGs(vg) === true }">
              <img :src="vg.image_link" class="icon" />
              <span>{{ vg.name }}</span>
            </div>
          </div>
        </div>
        <button class="typeSubmit" @click="addPost">New Post</button>
      </div>
      <!-- Create QCM -->
      <div id="creationQCM" class="mainComponent">
        <h2 class="title1">QCM</h2>
        <div v-for="(question, index) in newQcm" :key="index">
          <QuestionComponent :question="question" :index="index" @remove="removeQuestion(index)" />
        </div>
        <div id="buttonsQCM">
          <button class="typeSubmit" type="button" @click="addQuestion">+ Add Question</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== GENERAL ===== */
* {
  box-sizing: border-box;
}
#homePage,
#creationPost {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: var(--spacing-md);
}
#homePage {
  min-height: 0;
}
/* ====== QCM ====== */
#creationQCM {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ===== CREATION POST ===== */
#newPost {
  display: flex;
  gap: var(--spacing-lg);
  height: 100%;
}
#creationPost form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
#creationPost form div {
  display: flex;
  flex-direction: column;
}
#labelPostForm {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

#VGsDisplay {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md);
}
.VG {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-primary);
  background-color: var(--bg-item-primary);
  padding: var(--spacing-md) 12px;
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  box-sizing: border-box;
  border: 2px solid transparent;
}
.VG:hover{
  background-color: var(--bg-button-hover);
  color: var(--text-primary);
  transform: translateY(-2px);
}
.VG.selected {
  background-color: var(--bg-button-hover);   /* même couleur que le hover */
  border: 2px solid var(--main-primary);    /* la bordure que tu veux */
  color: var(--text-primary);
  transform: scale(0.9);
}

/* ===== POSTS CONTAINER ===== */
#postsContainer,
#answersContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  height: 100%;
  flex: 1;            /* occupe l’espace disponible */
  min-height: 0;
  overflow: hidden;
  overflow-y: auto;
}


/* ===== ANSWER ===== */
#answersPost {
  display: flex;
  flex-direction: column;
  flex: 1;            /* prend tout l’espace dispo dans answersContainer */
  min-height: 0;       /* NE PAS retirer */
  overflow-y: auto;    /* scroll interne */
  gap: var(--spacing-md);
  border: 1px solid var(--main-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
</style>
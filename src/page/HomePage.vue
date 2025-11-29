<script>
import axios from 'axios'
import { eventBus } from '@/eventBus'
import FloatingButton from '@/components/FloatingButton.vue'
import QuestionComponent from '@/components/QuestionComponent.vue'
import PostBox from '@/components/PostBox.vue'
import AnswerComponent from '@/components/AnswerComponent.vue'
import QCMComposent from '@/components/QCMComposent.vue'
import PostCreation from '@/components/postCreationComponent.vue'

export default {
  components: { AnswerComponent, FloatingButton, QuestionComponent, PostBox, QCMComposent, PostCreation },
  props: {
    id: String,
    vgs: Object,
  },

  data() {
    return {
      // Posts
      posts: [],

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
      isDoingQCM: false,
      isManager: false,
      isAdmin: false,
      selectedPost: null,
      selectedQCM: null,
      selectedAnswer: null,
    }
  },
  methods: {
    async fetchPosts(searchKey) {
      var response;
      const token = localStorage.getItem('token')
      if (searchKey){
        console.log(searchKey);
        if (this.id === "0"){
          response = await axios.get(`http://localhost:3000/post/?q=${searchKey}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        }
        else {
          response = await axios.get(`http://localhost:3000/post/?gs=${this.id}&q=${searchKey}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        }
      }
      else{
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
      }
      this.posts = response.data
      for (const post of this.posts) {
        const plays = await axios.get(`http://localhost:3000/post/${post.id_post}/play`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        post.isPlayed = plays.data.played
        post.plays = plays.data.amount
      }
    },
    async fetchMe() {
      const token = localStorage.getItem('token')
      const me = await axios.get('http://localhost:3000/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.isManager = me.data.roles.includes("manager");
      this.isAdmin = me.data.roles.includes("sysadmin")
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
      this.selectedPost = response.data.post
      this.selectedAnswer = response.data.replies
      this.selectedQCM = response.data.qset
      this.isAnswering = true
      this.selectedPost.plays = plays.data.amount
      this.selectedPost.isPlayed = plays.data.played
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
    async setQCM(post){
      this.isDoingQCM = true;
    },
    setQCMFalse(){
      this.isDoingQCM = false;
    },
    async delPost(postId){
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3000/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.fetchPosts()
    },
  },
  async mounted() {
    const token = localStorage.getItem('token')
    await this.fetchVGs();
    await this.fetchPosts();
    await this.fetchMe();
    eventBus.on("fetchPosts", (searchKey) => {
      this.fetchPosts(searchKey);
    });
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
      <div id="post" v-for="post in posts" @click="selectPost(post)">
        <div class="post">
          <PostBox
            :post="post"
            @togglePlays="togglePlays(post)"
          />
        </div>
        <button v-if="this.isManager" @click.stop="delPost(post.id_post)" class="normalButton1">🗑️</button>
      </div>
    </div>

    <!-- REPLY -->
    <div id="selectedPostPage" v-if="!isCreatingPost && isAnswering">
      <div id="leftSelectPostPage" >
        <div id="answersContainer" class="mainComponent" >
          <div class="post">
            <PostBox
              :post="selectedPost"
              @togglePlays="togglePlays(selectedPost)"
            />
          </div>
          <button class="typeSubmit" @click="setQCM(this.selectedPost)" v-if="!isDoingQCM">Do the MCQ</button>
          <button class="typeSubmit" @click="setQCMFalse" v-if="isDoingQCM">Stop the MCQ</button>
          <div id="answersPost">
            <p class="textLabel">Comments :</p>
            <div id="answer" class="post" v-for="answer in selectedAnswer">
              <p>{{ answer.post.content }}</p>
              <p class="textLabel">{{ new Date(answer.post.publish_date).toLocaleString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }) }}</p>
              <p class="textLabel">{{answer.post.publisher}}</p>
            </div>
          </div>
        </div>
        <div id="answerBar" class="mainComponent" v-if="isAnswering & !isCreatingPost">
          <form id="replyBar" class="mainSearchZone" @submit.prevent="addAnswer">
            <label>Reply :</label>
            <input class="searchTextZone" v-model="newPost.content" />
            <button class="typeSubmit">Reply</button>
          </form>
        </div>
      </div>
      <!-- DO THE MCQ -->
      <div class="mainComponent" id="rightSelectedPostPage" v-if="!isCreatingPost && isAnswering && isDoingQCM">
        <QCMComposent
          :qcm="this.selectedQCM"
          :idPost="this.selectedPost.id_post"
        />
      </div>
    </div>

    <!-- ADD POST -->
    <div id="newPost" v-if="isCreatingPost">
      <div id="creationPost" class="mainComponent">
        <FloatingButton class="typeSubmit" @click="toggleIsCreatingPost">-</FloatingButton>
        <!-- General informations -->
        <PostCreation
          :post="this.newPost"
        />
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

#post {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-xs);
}
/* ====== QCM ====== */
#creationQCM {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  overflow-y: auto;
  height: 100%;
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
  flex-wrap: wrap;
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
#postsContainer, #answersContainer {
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
#selectedPostPage {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md);
  height: 100%;
}
#leftSelectPostPage {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  height: 100%;
  width: 100%;
}
#rightSelectedPostPage {
  display: flex;
  width: 100%;
}
#answer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  * {
    max-width: 100vw;
    width: 100%;
    box-sizing: border-box;
  }
  #newPost {
    flex-direction: column;
    height: 100%;
  }
  #creationPost {
    height: auto;
  }
  #creationQCM {
    height: auto;
  }
  #replyBar {
    display: flex;
  }
  #replyBar input {
    width: 100%;
  }
  #replyBar label {
    width: auto;
  }
  #replyBar button {
    width: auto;
  }
  #selectedPostPage {
    flex-direction: column;
  }
  .VG img {
    width: auto;
  }
}
</style>
<script>
import axios from 'axios'
import { eventBus } from '@/eventBus.js'
import FloatingButton from '@/components/Utilities/Buttons/FloatingButton.vue'
import QuestionComponent from '@/components/Posts/QCM/QuestionComponent.vue'
import PostBox from '@/components/Posts/PostBox.vue'
import AnswerComponent from '@/components/Posts/QCM/AnswerComponent.vue'
import QCMComposent from '@/components/QCMComposent.vue'
import PostCreation from '@/components/Posts/postCreationComponent.vue'
import {domain, http_proto} from '@/main.js'

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

      // Me
      me: null,

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
        signals: 0,
        isPlayed: false,
        isSignaled: false,
        publish_date: '',
        publisher: '',
        qsetArray: '',
        vgd: [],
      },

      //QCM Params
      maxTitleLength: 45,
      maxContentLength: 500,
      maxQuestionsLength: 45,
      maxAnswersLength: 45,

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
          response = await axios.get(http_proto+domain+`/post/?q=${searchKey}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        }
        else {
          response = await axios.get(http_proto+domain+`/post/?gs=${this.id}&q=${searchKey}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        }
      }
      else{
        if (this.id === "0"){
          response = await axios.get(http_proto+domain+'/post', {
            headers: { Authorization: `Bearer ${token}` },
          })
        }
        else {
          response = await axios.get(http_proto+domain+`/post/?gs=${this.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        }
      }
      this.posts = response.data
      for (const post of this.posts) {
        const plays = await axios.get(http_proto+domain+`/post/${post.id_post}/play`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        post.isPlayed = plays.data.played
        post.plays = plays.data.amount
        await this.getSignals(post)
      }
    },
    async fetchMe() {
      const token = localStorage.getItem('token')
      const me = await axios.get(http_proto+domain+`/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.me = me.data
      this.isManager = me.data.roles.includes("manager");
      this.isAdmin = me.data.roles.includes("sysadmin")
    },
    async fetchVGs() {
      const token = localStorage.getItem('token')
      const VGS = await axios.get(http_proto+domain+`/vgd`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      this.listVg = VGS.data;
    },
    async addPost() {
      if (this.newPost.title === '' || this.newPost.content === '' || this.newPost.vgd.length === 0) {
        alert("You must fill all the fields\nAnd don't forget the Video Game Tag")
        return
      }
      if (this.newPost.title.length > this.maxTitleLength) {
        alert(`The title cannot exceed ${this.maxTitleLength} characters.`);
        return;
      }
      if (this.newPost.content.length > this.maxContentLength) {
        alert(`The content cannot exceed ${this.maxContentLength} characters.`);
        return;
      }
      if (this.newQcm.length < 1) {
        alert("You must have at least one question !");
        return;
      }

      for (const question of this.newQcm){
        let nbGoodAnswers = 0;
        if (question.prompt.length > this.maxQuestionsLength) {
          alert(`One question exceed ${this.maxQuestionsLength} characters.`);
          return;
        }
        if (question.prompt.length < 1) {
          alert(`All the question must be filled`);
          return;
        }
        if (question.questionArray.length < 2) {
          alert(`All the questions must contain at least 2 answers.`);
          return;
        }
        for (const answer of question.questionArray){
          if (answer.statement.length > this.maxAnswersLength) {
            alert(`An answer cannot exceed ${this.maxAnswersLength} characters.`);
            return;
          }
          if (answer.statement.length < 1) {
            alert(`All the answers must be filled`);
            return;
          }
          if (answer.is_correct) {
            nbGoodAnswers += 1;
          }
        }
        if (nbGoodAnswers < 1) {
          alert(`All the questions must have at least 1 good answer.`);
          return;
        }
      }
      const token = localStorage.getItem('token')
      this.newPost.qsetArray = this.newQcm

      await axios.post(http_proto+domain+`/post`, this.newPost, {
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
        const plays = await axios.get(http_proto+domain+`/post/${post.id_post}/play`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        post.isPlayed = plays.data.isPlayed
        post.plays = plays.data.amount
      }
      this.isCreatingPost = false
    },
    async addAnswer() {
      if (this.newPost.content === ''){
        return;
      }
      const token = localStorage.getItem('token')
      await axios.post(
        http_proto+domain+`/post/${this.selectedPost.id_post}/reply`,
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
      const plays = await axios.get(http_proto+domain+`/post/${post.id_post}/play`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      post.isPlayed = plays.data.played
      if (post.isPlayed) {
        await axios.delete(http_proto+domain+`/post/${post.id_post}/play`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        post.isPlayed = false
      } else {
        await axios.post(http_proto+domain+`/post/${post.id_post}/play`, '', {
          headers: { Authorization: `Bearer ${token}` },
        })
        post.isPlayed = true
      }
      const playsUpdate = await axios.get(http_proto+domain+`/post/${post.id_post}/play`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      post.plays = playsUpdate.data.amount
    },
    async signal(post){
      const token = localStorage.getItem('token')
      if (!post.isSignaled) {
        await axios.post(http_proto+domain+`/post/${post.id_post}/signal`, '', {
          headers: { Authorization: `Bearer ${token}` },
        })
        post.isSignaled = true
      }
      await this.getSignals(post)
    },
    async getSignals(post){
      const token = localStorage.getItem('token')
      const signals = await axios.get(http_proto+domain+`/post/${post.id_post}/signal`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      post.isSignaled = signals.data.signaled
      post.signals = signals.data.amount
    },
    async selectPost(post) {
      console.log(post)
      const token = localStorage.getItem('token')
      const response = await axios.get(http_proto+domain+`/post/${post.id_post}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const plays = await axios.get(http_proto+domain+`/post/${post.id_post}/play`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.selectedPost = response.data.post
      this.selectedAnswer = response.data.replies
      this.selectedQCM = response.data.qset
      this.isAnswering = true
      this.selectedPost.plays = plays.data.amount
      this.selectedPost.isPlayed = plays.data.played
      await this.getSignals(this.selectedPost)
    },
    setIsAnsweringFalse(){
      this.selectedPost = null
      this.selectedAnswer = null
      this.selectedQCM = null
      this.isAnswering = false
    },
    addQuestion() {
      this.newQcm.push({
        id_question: '',
        prompt: '',
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
      await axios.delete(http_proto+domain+`/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.isAnswering = false
      this.isCreatingPost = false
      this.isDoingQCM = false
      this.selectedPost = null
      this.selectedQCM = null
      this.selectedAnswer = null
      this.fetchPosts()
    },
    async delAnswer(answer){
      const token = localStorage.getItem('token')
      await axios.delete(http_proto+domain+`/post/${answer.post.id_post}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await this.selectPost(this.selectedPost)
    },
    isMyAnswer(answer){
      return answer.post.publisher === this.me.username
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
    eventBus.on("refreshPage", (searchKey) => {
      this.isAnswering = false
      this.isCreatingPost = false
      this.isDoingQCM = false
      this.selectedPost = null
      this.selectedQCM = null
      this.selectedAnswer = null
      this.fetchPosts()
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
      <div v-if="posts.length === 0" class="noPosts">
        <p class="title1">There are no posts corresponding</p>
        <p class="title2">Try searching others things or somewhere esle</p>
      </div>
      <div id="post" v-for="post in posts" @click="selectPost(post)">
        <div class="post">
          <PostBox
            :post="post"
            @togglePlays="togglePlays(post)"
            @signal="signal(post)"
          />
        </div>
      </div>
    </div>

    <!-- REPLY -->
    <div id="selectedPostPage" v-if="!isCreatingPost && isAnswering">
      <div id="leftSelectPostPage" >
        <div id="answersContainer" class="mainComponent" >
          <div class="postAndDelete">
            <div class="post" @click="setIsAnsweringFalse">
              <PostBox
                :post="selectedPost"
                @togglePlays="togglePlays(selectedPost)"
                @signal="signal(selectedPost)"
              />
            </div>
            <button v-if="this.isManager" @click.stop="delPost(this.selectedPost.id_post)" class="normalButton1">🗑️</button>

          </div>
          <button class="typeSubmit" @click="setQCM(this.selectedPost)" v-if="!isDoingQCM">Do the MCQ</button>
          <button class="typeSubmit" @click="setQCMFalse" v-if="isDoingQCM">Stop the MCQ</button>
          <div id="answersPost">
            <p class="textLabel">Comments :</p>
            <div class="postAndDelete" v-for="answer in selectedAnswer">
              <div id="answer" class="post">
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
              <button class="delete" v-if="isMyAnswer(answer)" @click="delAnswer(answer)">🗑️</button>
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
        <FloatingButton class="typeSubmit" @click="toggleIsCreatingPost">←</FloatingButton>
        <!-- General informations -->
        <h2 class="title1">Post</h2>
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
  min-height: 0;
}
#homePage {
  min-height: 0;
  height: 100%;
}

#post {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-xs);
}
#post:hover {
  transform: scale(0.995);
  transition: var(--transition-slow);
}
/* ====== QCM ====== */
#creationQCM {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  overflow-y: auto;
  height: 100%;
  min-height: 0;
}

/* ===== CREATION POST ===== */
#newPost {
  display: flex;
  gap: var(--spacing-lg);
  height: 100%;
  min-height: 0;
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

/* ===== POSTS CONTAINER ===== */
#postsContainer, #answersContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  height: 100%;
  flex: 1;            /* occupe l’espace disponible */
  min-height: 0;
  overflow-y: auto;
}
#selectedPostPage {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md);
  height: 100%;
  min-height: 0;
}
#leftSelectPostPage {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  height: 100%;
  width: 100%;
  min-height: 0;
}
#rightSelectedPostPage {
  display: flex;
  width: 100%;
  min-height: 0;
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
#answer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {

  #homePage {
    max-width: 100vw;
    width: 100%;
    overflow: auto;
    min-height: 100%;
  }
  #creationPost {
    width: 100%;
    min-height: auto;      /* laisse la hauteur s'adapter au contenu */
  }
  #newPost {
    flex-direction: column;
    height: 100%;
    overflow: auto;
    min-height: 100%;
  }
  #creationPost {
    height: auto;
  }
  #creationQCM {
    overflow-y: auto;
    min-height: 100%;
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
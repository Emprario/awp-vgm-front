<script>
import axios from 'axios'
import FloatingButton from '@/components/FloatingButton.vue'
import QuestionComponent from '@/components/QuestionComponent.vue'

export default {
  components: { FloatingButton, QuestionComponent },

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
              is_correct: '',
              statement: ''
            },
          ]
        },
      ],
      newPost: {
        id_post: '',
        title: '',
        content: '',
        qsetArray: '',
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
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/post', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.posts = response.data;
    },
    async addPost() {
      const token = localStorage.getItem('token');
      this.newPost.qsetArray = this.newQcm;

      await axios.post('http://localhost:3000/post', this.newPost, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.newPost = {
        id_post: '',
        title: '',
        content: '',
        plays:'',
        qsetArray: '',
      };
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
              statement: ''
            },
          ]
        },
      ];

      const response = await axios.get('http://localhost:3000/post', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.posts = response.data;
    },
    async addAnswer(){
      console.log(this.newPost.content);
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3000/post/${this.selectedPost.id_post}`, { content: this.newPost.content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.newPost.content = '';
      this.selectPost(this.selectedPost);
    },
    toggleIsAnswering() {
      console.log('toggleIsAnswering');
      this.isAnswering = !this.isAnswering;
    },
    toggleIsCreatingPost() {
      this.isCreatingPost = !this.isCreatingPost;
    },
    async selectPost(post) {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/post/${post.id_post}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response);
      this.selectedPost = response.data.post[0];
      this.selectedAnswer = response.data.replies;
      this.selectedQCM = response.data.qset;
      this.isAnswering = true;
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
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/post', {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.posts = response.data;

  }
 };
</script>

<template>
<div id="homePage">
  <!-- GET ALL POSTS -->
  <div id="postsContainer" class="mainComponent" v-if="!isCreatingPost & !isAnswering">
    <FloatingButton class="typeSubmit" @click="toggleIsCreatingPost">+</FloatingButton>
    <div class="post" v-for="post in posts" @click="selectPost(post)">
      <h2>{{post.title}}</h2>
      <p>{{post.content}}</p>
      <hr class="separator">
      <div id="utilsPostBar">
        <div>
          <svg
            class="playButton"
            onclick="this.classList.toggle('active')"
            @click.stop
            xmlns="http://www.w3.org/2000/svg"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        <p class="textLabel">fes</p>
      </div>
    </div>
  </div>

  <!-- REPLY -->
  <div id="answersContainer" class="mainComponent" v-if="!isCreatingPost && isAnswering">
    <div id="headPost" class="post">
      <h2>{{selectedPost.title}}</h2>
      <p>{{selectedPost.content}}</p>
    </div>
    <button class="typeSubmit">Do the QCM</button>

    <div id="answersPost">
      <p class="textLabel">Comments :</p>
      <div class="post" v-for="answer in selectedAnswer">
        <p>{{answer.post[0].content}}</p>
      </div>
    </div>
  </div>
  <div id="answerBar" class="mainComponent" v-if="isAnswering & !isCreatingPost">
    <form class="mainSearchZone" @submit.prevent="addAnswer">
      <label>Reply :</label>
      <input class="searchTextZone" v-model="newPost.content">
      <button class="typeSubmit">Reply</button>
    </form>
  </div>

  <!-- ADD POST -->
  <div id="newPost" v-if="isCreatingPost">
    <div id="creationPost" class="mainComponent">
      <FloatingButton class="typeSubmit" @click="toggleIsCreatingPost">-</FloatingButton>
      <div id="labelPostForm">
        <label class="title1">Title</label>
        <input type="text" class="normalInputText" v-model="newPost.title">

        <label class="title1">Content</label>
        <input type="text" class="normalInputText" v-model="newPost.content">
      </div>
      <button class="typeSubmit" @click="addPost">New Post</button>
    </div>
    <!-- Create QCM -->
    <div id="creationQCM" class="mainComponent">
      <h2 class="title1">QCM</h2>
      <div v-for="(question, index) in newQcm" :key="index">
        <QuestionComponent
            :question="question"
            :index="index"
            @remove="removeQuestion(index)"
        />
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
*{
  box-sizing: border-box;
}
#homePage, #creationPost {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: var(--spacing-md);
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
#creationPost form{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
#creationPost form div{
  display: flex;
  flex-direction: column;
}
#labelPostForm {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ===== POSTS CONTAINER ===== */
#postsContainer, #answersContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  height: 100%;
}
.post *{
  margin: 0;
}
.post{
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  width: 100%;
  gap: var(--spacing-xs);
  border-radius: var(--radius-lg);
  background-color: var(--bg-item-primary);
  color: #e0e0e0;
}
.post:hover{
  background-color: var(--bg-item-hover-primary);
}
.post h2{
  color: var(--main-primary);
}

/* ===== ANSWER ===== */
#answersPost {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  border: 1px solid var(--main-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* ===== UTILS POSTS BAR */
.playButton {
  width:var(--spacing-xl);
  height:var(--spacing-xl);
  fill:none;
  stroke:var(--secondary-primary);
  transition: all 0.3s ease;
}
.playButton.active {
  fill: var(--secondary-primary);
  transform: scale(1.1);
}
#utilsPostBar {
  display: flex;
  justify-content: space-between;
}
#utilsPostBar div {
  display: flex;
  gap: var(--spacing-xs);
}

</style>
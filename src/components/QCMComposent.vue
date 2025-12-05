<script>
import axios from 'axios'

export default {
  name: 'QCMComposent',
  props: {
    idPost: String,
    qcm: Object,
  },

  data() {
    return {
      currentQuestion: '',
      indexCurrentQuestion: 1,
      selectedAnswers: [],
      answersChecked: false,
      isFinished: false,
      session: null,
      score: null,
      avgScore: null,
    }
  },
  methods: {
    toggleInSelectedAnswers(answer) {
      const index = this.selectedAnswers.indexOf(answer.id_question)

      if (index !== -1) {
        // déjà dedans → enlever
        this.selectedAnswers.splice(index, 1)
      } else {
        // pas dedans → ajouter
        this.selectedAnswers.push(answer.id_question)
      }
    },
    isInSelectedAnswers(answer) {
      return this.selectedAnswers.indexOf(answer.id_question) !== -1
    },
    sameElements(a, b) {
      if (a.length !== b.length) return false
      const A = [...a].sort()
      const B = [...b].sort()
      return A.every((val, i) => val === B[i])
    },
    async checkAnswer() {
      const data = []
      console.log('selectedAnswers', this.selectedAnswers)
      for (let answer of this.currentQuestion.questionArray) {
        data.push({
          id_set: answer.id_set,
          id_question: answer.id_question,
          is_correct: this.isInSelectedAnswers(answer),
        })
      }
      console.log(data)
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `http://localhost:3000/post/${this.idPost}/submit`,
        {
          id_session : this.session,
          data : data, },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      console.log(response)
      this.answersChecked = true
      this.session = response.data.id_session
      this.colorAnswers(response.data.data)
    },
    colorAnswers(data) {
      data.forEach((answer, index) => {
        const el = this.$refs['answer' + index][0] // Vue 3 renvoie une array

        if (!el) return

        if (this.isInSelectedAnswers(answer)) {
          el.style.backgroundColor = answer.right ? '#63d5b0' : '#e4165c'
          el.style.borderColor = answer.right ? '#1b3b30' : '#4a061e'
          el.style.color = '#333'
        } else {
          el.style.backgroundColor = answer.right ? '' : '#ffd77c'
          el.style.borderColor = answer.right ? '#' : '#655531'
          el.style.color = answer.right ? '' : '#333'
        }
      })
    },
    nextQuestion() {
      this.answersChecked = false
      this.selectedAnswers = []
      if (this.qcm[this.indexCurrentQuestion]) {
        this.currentQuestion = this.qcm[this.indexCurrentQuestion]
        this.indexCurrentQuestion = this.indexCurrentQuestion + 1
      } else {
        this.isFinished = true
        this.getScore()
      }
    },
    async getScore() {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:3000/session/${this.session}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.score = response.data.score
    },
    async getAvgScore() {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:3000/post/${this.idPost}/score`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.avgScore  = response.data.AVG_score;
    }
  },
  async mounted() {
    this.currentQuestion = this.qcm[0]
    this.indexCurrentQuestion = 1
    await this.getAvgScore()
  },
}
</script>

<template>
  <div id="QCM">
    <div id="topQCM" v-if="!isFinished">
      <h2 class="title1">Question {{ this.indexCurrentQuestion }} :</h2>
      <div id="QuestAns">
        <h3 class="title">{{ this.currentQuestion.prompt }}</h3>
        <div
          id="answers"
          v-for="(answer, index) in this.currentQuestion.questionArray"
          :key="indexCurrentQuestion + '-' + index"
          @click="toggleInSelectedAnswers(answer)"
          :class="{ selected: this.isInSelectedAnswers(answer) === true }"
          :ref="'answer' + index"
        >
          <p>{{ answer.statement }}</p>
        </div>
      </div>
    </div>
    <div id="finished" v-if="isFinished">
      <h2 class="title1">The MCQ is Finished</h2>
      <div class="scoreContainer">
        <div class="score myScore">
          <p>Your score</p>
          <p>{{this.score}}</p>
        </div>
        <div class="score avgScore">
          <p>Average score</p>
          <p>{{this.avgScore}}</p>
        </div>
      </div>
    </div>
    <button class="typeSubmit" v-if="!answersChecked && !isFinished" @click="checkAnswer">
      Check Answer
    </button>
    <button class="typeSubmit" v-if="answersChecked && !isFinished" @click="nextQuestion">
      Next Question
    </button>
  </div>
</template>

<style scoped>
/* ===== GENERAL ===== */
#QCM {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-md);
  width: 100%;
}
#topQCM {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* ===== QUESTIONS & ANSWERS ===== */
#QuestAns {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--main-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  gap: var(--spacing-md);
}
#answers {
  display: flex;
  flex-direction: row;
  color: var(--text-primary);
  background-color: var(--bg-item-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
  transition: var(--transition-normal);
}
#answers:hover {
  background-color: var(--bg-button-hover);
}
#answers.selected {
  background-color: var(--bg-button-hover); /* même couleur que le hover */
  border: 2px solid var(--main-primary); /* la bordure que tu veux */
  color: var(--text-primary);
  transform: scale(0.97);
}
#answers p {
  margin: var(--spacing-xs);
}

/* SCORES */
#finished {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-lg);
  animation: fadeIn 0.4s ease-out;
  height: 100%;
  justify-content: center;
}

  /* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes popIn {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 768px) {
  * {
    max-width: 100vw;
    width: 100%;
    box-sizing: border-box;
  }
  #scoreContainer {
    flex-direction: column;
  }
}

</style>
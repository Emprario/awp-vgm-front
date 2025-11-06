<template>
  <div id="questions">
    <div id="titleQuestion">
      <h3 class="title">Question {{ index + 1 }}</h3>
      <input
          class="normalInputText"
          type="text"
          placeholder="Question Statement"
          v-model="question.prompt"
      />
    </div>

    <!-- Liste des réponses -->
    <div id="answers">
      <AnswerComponent
        v-for="(answer, i) in question.questionArray"
        :key="i"
        :answer="answer"
        @remove="removeAnswer(i)"
      />
    </div>
    <div id="buttonsQuestion">
      <button class="typeSubmit" type="button" @click="addAnswer">+ Add answer</button>
      <button class="typeDelete" type="button" @click="$emit('remove')">🗑 Delete Question</button>
    </div>
  </div>
</template>

<script>
import AnswerComponent from './AnswerComponent.vue'

export default {
  name: 'QuestionComponent',
  components: { AnswerComponent },
  props: {
    question: Object,
    index: Number,
  },
  methods: {
    addAnswer() {
      this.question.questionArray.push({
        id_answer: '',
        statement: '',
        is_correct: false,
      })
    },
    removeAnswer(index) {
      this.question.questionArray.splice(index, 1)
    },
  },
}
</script>

<style scoped>
*{
  box-sizing: border-box;
}
#questions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  border: 1px solid var(--main-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
#titleQuestion, #answers {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: var(--bg-item-primary);
}
#buttonsQuestion {
  display: flex;
  justify-content: space-between;
}
</style>

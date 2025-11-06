<template>
  <div id="answer">
    <input
      class="normalInputText"
      type="text"
      placeholder="Answer"
      v-model="answer.statement"
    />
    <input type="checkbox" v-model="answer.is_correct" />
    <button class="typeNormal" type="button" @click="$emit('remove')">🗑</button>
  </div>
</template>

<script>
export default {
  name: 'AnswerComponent',
  props: {
    answer: Object,
  },
}
</script>

<style scoped>
#answer {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>

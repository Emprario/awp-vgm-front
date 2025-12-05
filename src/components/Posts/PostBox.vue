<script>
export default {
  props: {
    post: Object,
  },
}

</script>

<template>
  <h2>{{post.title}}</h2>
  <p>{{post.content}}</p>
  <hr class="separator">
  <div id="utilsPostBar">
    <div>
      <svg
        class="playButton"
        @click="$emit('togglePlays')"
        :fill="post.isPlayed ? 'currentColor' : 'none'"
        @click.stop
        xmlns="http://www.w3.org/2000/svg"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z"/>
      </svg>
      <p>{{post.plays}}</p>
      <p id="signals"
         @click.stop
         @click="$emit('signal')"
         :style="{ backgroundColor: post.isSignaled ? '#a0a9c2' : '' }">Signals</p>
      <p>{{post.signals}}</p>
    </div>
    <p class="textLabel">
      {{ new Date(post.publish_date).toLocaleString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) }}
    </p>
    <p class="textLabel">{{post.publisher}}</p>
  </div>
</template>

<style scoped>
h2 {
  color: var(--main-primary);
}
.playButton {
  width: var(--spacing-xl);
  height: var(--spacing-xl);
  stroke: var(--secondary-primary);
  transition: all 0.3s ease;
}

#utilsPostBar {
  display: flex;
  justify-content: space-between;
}
#utilsPostBar div {
  display: flex;
  gap: var(--spacing-xs);
}
#signals {
  border: 1px solid var(--secondary-primary);
  border-radius: var(--spacing-xs);
}
</style>
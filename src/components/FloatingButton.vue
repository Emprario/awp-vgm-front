<template>
  <button id="floating-btn" @click="$emit('toggleIsCreatingPost')">
    <slot>+</slot>
  </button>
</template>

<script>
export default {
  name: 'FloatingButton'
}
</script>

<style>
@import "../../public/styles.css";

#floating-btn {
  width: 40px;
  height: 40px;
  position: fixed;
  top: 75px;
  right: 35px;
  z-index: 1000;
}
</style>

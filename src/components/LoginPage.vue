<script setup>
import LoginBox from './LoginBox.vue';
</script>

<template>
  <div class="md:top-40 md:left-30 md:absolute p-8 md:p-0">
    <h1 class="text-4xl sm:text-5xl lg:text-6xl">The <br>VideoGame<br>Forum</h1>
  </div>
  <div
    class="top-1/2 md:top-1/2 md:right-1/8 left-1/2 absolute m-auto w-70 md:w-90 md:transform-none -translate-x-1/2 -translate-y-1/2 md:translate-none md:translate-none transform">
    <login-box></login-box>
  </div>
</template>

<style lang="css" scoped></style>
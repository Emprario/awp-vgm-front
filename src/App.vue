<script setup>
import LoginPage from './page/LoginPage.vue';
</script>

<template>
  <div class="top-0 left-0 -z-10 fixed bg-[url(/ffflurry.svg)] bg-cover w-full h-screen"></div>
  <login-page></login-page>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=BBH+Sans+Bartle&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');
@import 'tailwindcss';

@theme {
  /*--color-pureblack: #0e1428;*/
  --color-pureblack: #060723FF;
  --color-gamered: #C1292ECC;
  --font-bbh: "BBH Sans Bartle", sans-serif;
  --font-rubik: "Rubik", sans-serif;
}
</style>

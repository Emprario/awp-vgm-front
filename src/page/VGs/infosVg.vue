<script>
import axios from 'axios'
import { domain, http_proto } from '@/main.js'

export default {
  name: 'InfosVg',
  props: {
    id: String,
  },
  data (){
    return {
      vg: null,
    }
  },
  methods: {
    async fetchVg() {
      console.log(this.id)
      const token = localStorage.getItem('token')
      const response = await axios.get(http_proto+domain+`/vgd/${this.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.vg = response.data
    },
  },
  async mounted() {
    await this.fetchVg()
  },
  watch: {
    id: {
      immediate: true, // optionnel si tu veux relancer aussi au montage
      handler(newId, oldId) {
        this.fetchVg()
      }
    }
  }
}
</script>

<template>
<div class="mainComponent">
  <h2 class="title1">Informations Video Game</h2>
  <h2 v-if="vg" class="title2">Name :</h2>
  <p v-if="vg" class="post">{{vg.name}}</p>
  <h2 v-if="vg" class="title2">Release Date :</h2>
  <p v-if="vg" class="post">{{ new Date(vg.release_date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) }}</p>
  <h2 v-if="vg" class="title2">Description :</h2>
  <p v-if="vg" class="post">{{vg.description}}</p>
</div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
</style>
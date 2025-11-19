<script>
import axios from 'axios'

export default{
  data(){
    return {
      newVg: {
        name: '',
        image_link: '',
        release_date: '',
        description: '',
      }
    }
  },
  methods: {
    async addVg(){
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:3000/vgd', this.newVg, {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.$emit('refresh-vg');
    }
  }
}
</script>

<template>
  <div class="mainComponent" id="createVG">
    <h2 class="title1">ADD Video Game</h2>

    <label class="textLabel">Name</label>
    <input v-model="newVg.name" type="text" placeholder="Name of the video game" class="normalInputText" />

    <label class="textLabel">Image-Link</label>
    <input v-model="newVg.image_link" type="text" placeholder="Link of the image" class="normalInputText" />

    <label class="textLabel">Release Date</label>
    <input v-model="newVg.release_date" type="text" placeholder="Release date of the video game" class="normalInputText" />

    <label class="textLabel">Description</label>
    <input v-model="newVg.description" type="text" placeholder="Quick description of the video game" class="normalInputText" />

    <button @click="addVg" class="typeSubmit">Add Vg</button>
  </div>
</template>

<style scoped>
*{
  box-sizing: border-box;
}
#createVG {
  flex-direction: column;
  width: 100%;
  padding: var(--spacing-xl);
  height: auto;
}
#createVG * {
  margin: var(--spacing-xs);
}
</style>
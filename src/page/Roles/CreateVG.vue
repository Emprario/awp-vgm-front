<script>
import axios from 'axios'
import { eventBus } from '@/eventBus.js'

export default{
  data(){
    return {
      newVg: {
        name: '',
        image_link: '',
        release_date: '',
        description: '',
      },

      maxNameLength: 15,
      maxLinkLength: 250,
      maxDescriptionLength: 500,

      selectedVG: null,
    }
  },
  methods: {
    async addVg(){
      if (this.newVg.name.length > this.maxNameLength) {
        alert(`The name cannot exceed ${this.maxNameLength} characters.`);
        return;
      }
      if (this.newVg.image_link.length > this.maxLinkLength) {
        alert(`The image link cannot exceed ${this.maxLinkLength} characters.`);
        return;
      }
      if (this.newVg.description.length > this.maxDescriptionLength) {
        alert(`The description cannot exceed ${this.maxDescriptionLength} characters.`);
        return;
      }
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:3000/vgd', this.newVg, {
        headers: { Authorization: `Bearer ${token}` },
      })
      eventBus.emit('refreshVg');
    },
    async updateVG(){
      console.log(this.newVg)
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:3000/vgd/${this.selectedVG.id_vg}`, this.newVg, {
        headers: { Authorization: `Bearer ${token}` }
      })
      eventBus.emit('refreshVg');
    },
    async deleteVG(VGId){
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:3000/vgd/${VGId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      this.selectedVG = null;
      this.newVg = {
        name: '',
        image_link: '',
        release_date: '',
        description: '',
      };
      eventBus.emit('refreshVg');
    },
  },
  mounted() {
    eventBus.on('vgSelected', (vg) => {
      if (vg !== null){
        this.selectedVG = vg;
        this.newVg = vg;
        this.newVg.release_date = vg.release_date ? vg.release_date.substring(0, 10) : ''
      }
      else {
        this.selectedVG = null;
        this.newVg = {
          name: '',
          image_link: '',
          release_date: '',
          description: '',
        };
      }
    });
  }
}
</script>

<template>
    <div class="mainComponent" id="createVG">
      <div>
        <h2 class="title1" v-if="!this.selectedVG">ADD Video Game</h2>
        <h2 class="title1" v-if="this.selectedVG">Update Video Game</h2>

        <label class="title2">Name</label>
        <input
          v-model="newVg.name"
          type="text"
          placeholder="Name of the video game"
          class="normalInputText"
        />

        <label class="title2">Image-Link</label>
        <input
          v-model="newVg.image_link"
          type="text"
          placeholder="Link of the image"
          class="normalInputText"
        />

        <label class="title2">Release Date</label>
        <input
          v-model="newVg.release_date"
          type="date"
          class="normalInputText"
        />

        <label class="title2">Description</label>
        <input
          v-model="newVg.description"
          type="text"
          placeholder="Quick description of the video game"
          class="normalInputText"
        />

      </div>
      <div id="buttonsAdmin">
        <button v-if="!this.selectedVG" @click="addVg" class="typeSubmit">Add Vg</button>
        <button v-if="this.selectedVG" @click="updateVG" class="typeSubmit">Update Vg</button>
        <button v-if="this.selectedVG" @click="deleteVG(this.newVg.id_vg)" class="typeDelete">Delete Vg</button>
      </div>
    </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
#createVG {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 70px auto;
  padding: var(--spacing-xl);
  height: auto;
  justify-content: space-between;
}
#createVG * {
  margin: var(--spacing-xs);
}
#buttonsAdmin {
  display: flex;
}
#buttonsAdmin button {
  width: 100%;
}
</style>
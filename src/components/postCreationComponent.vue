<script>
import axios from 'axios'

export default {
  props: {
    post: Object,
  },
  data() {
    return {
      listVg: [],
    }
  },
  methods: {
    async fetchVGs() {
      const token = localStorage.getItem('token')
      const VGS = await axios.get('http://localhost:3000/vgd', {
        headers: { Authorization: `Bearer ${token}` }
      })

      this.listVg = VGS.data;
    },
    toggleInSelectedVGs(vg) {
      const index = this.post.vgd.indexOf(vg.id_vg);

      if (index !== -1) {
        // déjà dedans → enlever
        this.post.vgd.splice(index, 1);
      } else {
        // pas dedans → ajouter
        this.post.vgd.push(vg.id_vg);
      }
    },
    isInSelectedVGs(vg) {
      return this.post.vgd.indexOf(vg.id_vg) !== -1;
    },
  },
  async mounted() {
    await this.fetchVGs();
  }
}
</script>

<template>
  <div id="creationPost">
    <div id="labelPostForm">
      <label class="title2">Title</label>
      <input type="text" class="normalInputText" v-model="this.post.title" />

      <label class="title2">Content</label>
      <input type="text" class="normalInputText" v-model="this.post.content" />
    </div>
    <label class="title2">VG's Tags</label>
    <div id="VGsDisplay">
      <div id="1VG" v-for="vg in this.listVg">
        <div class="VG"
             @click="toggleInSelectedVGs(vg)"
             :class="{ selected: this.isInSelectedVGs(vg) === true }">
          <img :src="vg.image_link" class="icon" />
          <span>{{ vg.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== GENERAL ===== */
* {
  box-sizing: border-box;
}
#creationPost {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: var(--spacing-md);
}

/* ===== INFOS GEN ===== */
#labelPostForm {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* ===== VGs ===== */
#VGsDisplay {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}
.VG {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-primary);
  background-color: var(--bg-item-primary);
  padding: var(--spacing-md) 12px;
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  box-sizing: border-box;
  border: 2px solid transparent;
}
.VG:hover{
  background-color: var(--bg-button-hover);
  color: var(--text-primary);
  transform: translateY(-2px);
}
.VG.selected {
  background-color: var(--bg-button-hover);   /* même couleur que le hover */
  border: 2px solid var(--main-primary);    /* la bordure que tu veux */
  color: var(--text-primary);
  transform: scale(0.9);
}

@media (max-width: 768px) {
  * {
    max-width: 100vw;
    width: 100%;
    box-sizing: border-box;
  }
  #creationPost {
    height: auto;
    flex-shrink: 0;
  }
  #replyBar input {
    width: 100%;
  }
  #replyBar label {
    width: auto;
  }
  #replyBar button {
    width: auto;
  }
  #VGsDisplay {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }
  .VG img, .VG span, .VG {
    width: auto;
  }
}
</style>
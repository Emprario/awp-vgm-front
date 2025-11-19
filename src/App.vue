<template id="body">
  <div id="app">
    <!-- HEADER -->
    <header>
      <RouterLink to="/profil">👋 Profil</RouterLink>
      <div id="searchPostBar">
        <input class="mainSearchZone" type="text" placeholder="Search any post...">
        <button class="typeSubmit">Search</button>
      </div>
      <div id="roleTools">
        <RouterLink @refresh-vg="fetchVGs" to="/createVg" v-if="isManager">AddVG</RouterLink>
      </div>
    </header>

    <!-- CONTENT -->
    <div id="content">
      <!-- Nav -->
      <nav class="sideBar">
        <RouterLink class="typeRouterLink" :key="$route.fullPath"
                    :to="{
            name: 'vgPage',
            params: { id: 0 },
          }">🏠 Home</RouterLink>
        <div id="navBarGames" v-for="vg in listVg" :key="vg.id_vg">
          <RouterLink class="typeRouterLink"
            :to="{
            name: 'vgPage',
            params: { id: vg.id_vg },
            state: { vg }   // 👈 on passe l'objet entier ici
          }"> <img :src="vg.image_link" class="icon" />
              <span>{{ vg.name }}</span>
          </RouterLink>
        </div>
      </nav>
      <!-- Main -->
      <div id="mainContent">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import HomePage from '@/page/HomePage.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: { HomePage },
  data(){
    return {
      listVg:[],

      isManager:false,
    }
  },
  methods:{
    async fetchVGs() {
      const token = localStorage.getItem('token')
      const VGS = await axios.get('http://localhost:3000/vgd', {
        headers: { Authorization: `Bearer ${token}` }
      })

      this.listVg = VGS.data;
    },
  },
  async mounted() {
    const token = localStorage.getItem('token')
    const VGS = await axios.get('http://localhost:3000/vgd', {
      headers: { Authorization: `Bearer ${token}` },
    })
    this.listVg = VGS.data;

    const me = await axios.get('http://localhost:3000/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log(me)
    this.isManager = me.data.roles.includes("manager");
  },
}
</script>
<style scoped>
@import "../public/styles.css";
/* ===== GENERAL ===== */
#app{
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  min-height: 100vh;
}

/* ===== HEADER ===== */
header {
  display: flex;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  padding: var(--spacing-md) var(--spacing-xl);
  border-bottom: 1px solid var(--border-primary);
  box-shadow: var(--shadow-sm);
  margin: 0;
  height: var(--height-xs);
}
#searchPostBar {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  transform: scale(80%);
  width: 50%;
}

/* ===== SIDE BAR ===== */
.sideBar{
  display: flex;
  flex-direction: column;
  background-color: var(--bg-secondary);
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  min-width: 150px;
  border-right: 1px solid var(--border-primary);
  border-left: 1px solid var(--border-primary);
  min-height: var(--height-lg);
  box-shadow: var(--shadow-md);
}
#navBarGames {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}
.typeRouterLink {
  display: flex;
  text-decoration: none;
  color: var(--text-primary);
  background-color: var(--bg-item-primary);
  padding: var(--spacing-md) 12px;
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  border-left: 1px solid var(--main-primary);
  align-items: center;
  gap: var(--spacing-xs);
}
.typeRouterLink:hover{
  background-color: var(--bg-button-hover);
  color: var(--text-primary);
  transform: translateX(2px);
}

/* ===== CONTENT ====== */
#content{
  display: flex;
  flex-direction: row;
  min-height: var(--height-lg);
}
#mainContent{
  width: 100%;
  display: flex;
  margin: var(--spacing-xl);
  max-height: 620px;
}

</style>
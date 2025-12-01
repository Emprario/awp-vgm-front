<template id="body">
  <div id="app">
    <!-- HEADER -->
    <header>
      <!-- Bouton burger pour mobile -->
      <button class="burgerButton" @click="toggleSidebar">
        ☰
      </button>
      <div class="roleTools">
        <RouterLink class="adminButton" to="/profil">Profil</RouterLink>
        <RouterLink class="adminButton" to="/rules">Rules</RouterLink>
      </div>
      <div id="searchPostBar">
        <input id="searchBar" v-model="searchKey" type="text" placeholder="Search any post...">
        <button class="typeSubmit" @click="emitSearch">Search</button>
      </div>
      <div class="roleTools">
        <RouterLink class="adminButton" to="/createVg" v-if="isManager">Manage VG's</RouterLink>
        <RouterLink class="adminButton" to="/manageRoles" v-if="isAdmin">Manage Roles</RouterLink>
      </div>
    </header>

    <!-- CONTENT -->
    <div id="content" @click="sidebarOpen = false">
      <!-- Nav -->
      <nav class="sideBar" :class="{ open: sidebarOpen }">
        <RouterLink class="typeRouterLink" :key="$route.fullPath"
                    :to="{
            name: 'vgPage',
            params: { id: 0 },
          }">🏠 Home</RouterLink>
        <div id="navBarGames" v-for="vg in listVg" :key="vg.id_vg">
          <div id="navBarGamesInt">
            <RouterLink class="typeRouterLink"
                        :to="{
            name: 'vgPage',
            params: { id: vg.id_vg },
            state: { vg }   // 👈 on passe l'objet entier ici
          }"> <img :src="vg.image_link" class="icon" />
              <span>{{ vg.name }}</span>
            </RouterLink>
            <button class="normalButton2" v-if="$route.name === 'CreateVG'" @click="selectVG(vg)">✏️</button>
          </div>
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
import { eventBus } from '@/eventBus';

export default {
  name: 'App',
  components: { HomePage },

  data(){
    return {
      listVg:[],
      searchKey: '',
      isManager:false,
      isAdmin: false,
      sidebarOpen: false,
      selectedVG: '',
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
    async fetchMe() {
      const token = localStorage.getItem('token')
      const me = await axios.get('http://localhost:3000/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log(me)
      this.isManager = me.data.roles.includes("manager");
      this.isAdmin = me.data.roles.includes("sysadmin")
    },
    emitSearch() {
      eventBus.emit('fetchPosts', this.searchKey);
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    selectVG(VG){
      if (this.selectedVG !== VG){
        this.selectedVG = VG;
      }
      else {
        this.selectedVG = null;
      }
      eventBus.emit('vgSelected', this.selectedVG);
    },
  },
  async mounted() {
    const token = localStorage.getItem('token')
    eventBus.on('setEnv',async () => {
      await this.fetchVGs();
      await this.fetchMe();
    });
    eventBus.on("refreshVg", async () => {
      await this.fetchVGs();
    });
    await this.fetchVGs();
    await this.fetchMe();
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
  align-items: center;
}
#searchPostBar {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  transform: scale(80%);
  width: 50%;
}
#searchBar {
  width: 100%;
  background-color: var(--bg-theme-dark);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) 12px;
  box-sizing: border-box;
  color: white;
}
#searchBar:focus {
  color: white;
  border: 1px solid var(--main-primary);
  box-shadow: var(--shadow-accent);
}
.adminButton {
  border: 1px solid var(--main-primary);
  border-radius: var(--spacing-xs);
  padding: var(--spacing-xs);
  color: var(--main-primary);
  text-decoration: none;
}
.adminButton:hover {
  background-color: var(--bg-theme-dark);
}
.roleTools {
  display: flex;
  gap: var(--spacing-xs);
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
  box-sizing: border-box;
  text-decoration: none;
  color: var(--text-primary);
  background-color: var(--bg-item-primary);
  padding: var(--spacing-md) 12px;
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  border-left: 1px solid var(--main-primary);
  align-items: center;
  gap: var(--spacing-xs);
  width: 100%;
}
.typeRouterLink:hover{
  background-color: var(--bg-button-hover);
  color: var(--text-primary);
  transform: translateX(2px);
}
#navBarGamesInt {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-xs);
}

/* ===== CONTENT ====== */
#content{
  display: flex;
  flex-direction: row;
  min-height: 0;
}
#mainContent{
  width: 100%;
  display: flex;
  margin: var(--spacing-xl);
  min-height: 0;
}


/* ===== RESPONSIVE ===== */
/* SideBar */
.burgerButton {
  display: none;
  margin-right: var(--spacing-lg);
  font-size: 28px;
  border: none;
  background: none;
  color: var(--text-primary);
  cursor: pointer;
}

@media (max-width: 768px) {

  .burgerButton {
    display: block; /* Le bouton apparaît */
  }

  .sideBar {
    position: fixed;
    left: -260px;           /* Cachée à gauche */
    width: 150px;
    height: calc(100vh - var(--height-xs));
    background-color: var(--bg-secondary);
    box-shadow: var(--shadow-lg);
    transition: 0.3s ease-in-out;
    z-index: 1000;
  }

  .sideBar.open {
    left: 0;                /* Glisse vers l’écran */
  }

  #content {
    margin-left: 0;         /* Pour le main */
  }
}

</style>
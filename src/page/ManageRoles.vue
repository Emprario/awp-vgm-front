<script>
import axios from 'axios'
import { eventBus } from '@/eventBus.js'

export default {
  data() {
    return {
      username: '',
      role: '',
    }
  },
  methods: {
    async addRole(){
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:3000/user/assign', {
        username: this.username,
        role: this.role,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
    },
  }
}
</script>

<template>
  <div id="manageRolesPage" class="mainComponent">
    <div>
      <h2 class="title1">Manage Roles</h2>
      <label class="textLabel">Username</label>
      <input v-model="username" type="text" placeholder="Username" class="normalInputText" />

      <label class="textLabel">Role</label>
      <input v-model="role" type="text" placeholder="Role" class="normalInputText" />

    </div>
    <div id="buttonsAdmin">
      <button @click="addRole" class="typeSubmit">Add Role</button>
    </div>
  </div>
</template>

<style scoped>
/* ===== GENERAL ===== */
*{
  box-sizing: border-box;
}
#manageRolesPage {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 70px auto;
  padding: var(--spacing-xl);
  height: auto;
  justify-content: space-between;
}

#manageRolesPage * {
  margin: var(--spacing-xs);
}

#buttonsAdmin button {
  width: 100%;
}
</style>
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
    async deleteRole() {
      const token = localStorage.getItem('token')
      await axios.delete('http://localhost:3000/user/assign', {
        headers: { Authorization: `Bearer ${token}` },
        data: {        // 👈 ici, c’est correct
          username: this.username,
          role: this.role,
        }
      })
    },
  }
}
</script>

<template>
  <div id="manageRolesPage" class="mainComponent">
    <div>
      <h2 class="title1">Manage Roles</h2>
      <label class="title2">Username</label>
      <input v-model="username" type="text" placeholder="Username" class="normalInputText" />

      <select v-model="role" class="normalInputText">
        <option value="">Choose a role</option>
        <option value="sysadmin">Admin</option>
        <option value="manager">Manager</option>
      </select>

    </div>
    <div id="buttonsAdmin">
      <button @click="addRole" class="typeSubmit">Add Role</button>
      <button @click="deleteRole" class="typeDelete">Delete Role</button>
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
#buttonsAdmin {
  display: flex;
  flex-direction: row;
}
#buttonsAdmin button {
  width: 100%;
}
</style>
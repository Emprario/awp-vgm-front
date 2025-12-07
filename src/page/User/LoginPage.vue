<template>
  <div class="mainComponent" id="loginPage">
    <div>
      <h2 class="title1">Connexion</h2>

      <label>Username</label>
      <input v-model="username" type="text" placeholder="Username" class="normalInputText" />

      <label>Password</label>
      <input v-model="password" type="password" placeholder="Password" class="normalInputText" />
    </div>

    <div id="buttonsAdmin">
      <p>
        No Account ?
        <router-link to="/register" class="normalLink">Register</router-link>
      </p>
      <button @click="login" class="typeSubmit">Login</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { eventBus } from '@/eventBus.js';
import {domain, http_proto} from '@/main.js'

export default {
  data() {
    return {username:'', email: '', password: '' }
  },
  methods: {
    async login() {
      try {
        const res = await axios.post(http_proto+domain+`/auth/login`, {
          username: this.username,
          password: this.password
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        eventBus.emit('setEnv');
        this.$router.push('/profil')
      } catch (err) {
        alert('Email ou mot de passe incorrect')
      }
    }
  }
}
</script>

<style scoped>
/* ========== LOGIN PAGE ========== */
*{
  box-sizing: border-box;
}
#loginPage {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 70px auto;
  padding: var(--spacing-xl);
  height: auto;
  justify-content: space-between;
}

/* === Texte du bas === */
#loginPage p, #loginPage label {
  margin-top: 16px;
  color: #a0a9c2;
  font-size: 0.9rem;
  text-align: left;
}
#loginPage * {
  margin: var(--spacing-xs);
}
#buttonsAdmin button {
  width: 100%;
}
</style>

<template>
  <div class="mainComponent" id="loginPage">
    <h2 class="title1">Connexion</h2>

    <label>Username</label>
    <input v-model="username" type="text" placeholder="Username" class="normalInputText" />

    <label>Mot de passe</label>
    <input v-model="password" type="password" placeholder="Mot de passe" class="normalInputText" />

    <button @click="login" class="typeSubmit">Se connecter</button>

    <p>
      Pas de compte ?
      <router-link to="/register" class="normalLink">S'inscrire</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {username:'', email: '', password: '' }
  },
  methods: {
    async login() {
      try {
        const res = await axios.post('http://localhost:3000/auth/login', {
          username: this.username,
          password: this.password
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
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
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 70px auto;
  padding: var(--spacing-xl);
  height: auto;
}

/* === Texte du bas === */
#loginPage p, #loginPage label {
  margin-top: 16px;
  color: #a0a9c2;
  font-size: 0.9rem;
  text-align: left;
}

</style>

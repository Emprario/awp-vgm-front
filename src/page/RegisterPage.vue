<template>
  <div id="registerPage" class="mainComponent">
    <h2 class="title1">Créer un compte</h2>

    <form @submit.prevent="register">
      <label>Username</label>
      <input v-model="username" type="text" class="normalInputText"/>

      <label>Email</label>
      <input v-model="email" type="email" class="normalInputText"/>

      <label>Mot de passe</label>
      <input v-model="password" type="password" class="normalInputText"/>

      <button type="submit" class="typeSubmit">
        S'inscrire
      </button>
    </form>

    <p>
      Déjà un compte ?
      <router-link to="/login" class="normalLink">Se connecter</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserRegisterView',
  data() {
    return {
      username: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async register() {
      try {
        await axios.post('http://localhost:3000/auth/sign-in', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        alert('✅ Compte créé avec succès !')
        this.$router.push('/login')
      } catch (err) {
        alert(err.response?.data || 'Erreur lors de la création du compte')
      }
    }
  }
}
</script>
<style scoped>
*{
  box-sizing: border-box;
}
#registerPage {
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 70px auto;
  padding: var(--spacing-xl);
  height: auto;
}

#registerPage label, #registerPage p {
  margin-top: 16px;
  color: #a0a9c2;
  font-size: 0.9rem;
  text-align: left;
}
#registerPage * {
  margin: var(--spacing-xs);
}
</style>

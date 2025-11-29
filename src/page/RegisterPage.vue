<template>
  <div id="registerPage" class="mainComponent">
    <div>
      <h2 class="title1">Create an Account</h2>

      <label>Username</label>
      <input v-model="username" type="text" class="normalInputText" placeholder="username"/>

      <label>Email</label>
      <input v-model="email" type="email" class="normalInputText" placeholder="email"/>

      <label>Password</label>
      <input v-model="password" type="password" class="normalInputText" placeholder="password"/>
    </div>

    <div id="buttonsAdmin">
      <p>
        Already have an Account ?
        <router-link to="/login" class="normalLink">Login</router-link>
      </p>
      <button @click="register" type="submit" class="typeSubmit">Register</button>
    </div>
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
          mail: this.email,
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
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 70px auto;
  padding: var(--spacing-xl);
  height: auto;
  justify-content: space-between;
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
#buttonsAdmin button {
  width: 100%;
}
</style>

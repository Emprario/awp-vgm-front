import { createRouter, createWebHistory } from 'vue-router'
import ProfilUser from "../page/ProfilPage.vue";
import LoginUser from "../page/LoginPage.vue";
import RegisterUser from "../page/RegisterPage.vue";
import HomePage from "../page/HomePage.vue";

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/home', component: HomePage },
  { path: '/profil', component: ProfilUser },
  { path: '/login', component: LoginUser },
  { path: '/register', component: RegisterUser },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
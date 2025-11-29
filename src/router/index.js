import { createRouter, createWebHistory } from 'vue-router'
import ProfilUser from "../page/ProfilPage.vue";
import LoginUser from "../page/LoginPage.vue";
import RegisterUser from "../page/RegisterPage.vue";
import HomePage from "../page/HomePage.vue";
import CreateVG from "../page/CreateVG.vue";
import ManageRoles from '@/page/ManageRoles.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/profil', component: ProfilUser },
  { path: '/login', component: LoginUser },
  { path: '/register', component: RegisterUser },
  {
    path: '/manageRoles',
    name: 'ManageRoles',
    component: ManageRoles,
  },
  {
    path: '/createVg',
    name: 'CreateVG',
    component: CreateVG,
  },
  {
    path: '/vg/:id',
    name: 'vgPage',
    component: () => import('@/page/HomePage.vue'),
    props: route => ({
      id: route.params.id,
      vg: history.state.vg   // 👈 récupération automatique
    })
  },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
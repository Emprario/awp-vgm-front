import { createRouter, createWebHistory } from 'vue-router'
import ProfilUser from "../page/User/ProfilPage.vue";
import LoginUser from "../page/User/LoginPage.vue";
import RegisterUser from "../page/User/RegisterPage.vue";
import HomePage from "../page/VGs/HomePage.vue";
import CreateVG from "../page/Roles/CreateVG.vue";
import ManageRoles from '@/page/Roles/ManageRoles.vue'
import InfosVg from '@/page/VGs/infosVg.vue'
import RulesPage from '@/page/RulesPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/profil', component: ProfilUser },
  { path: '/rules', component: RulesPage },
  { path: '/login', name: 'login', component: LoginUser },
  { path: '/register', name: 'register', component: RegisterUser },
  {
    path: '/manageRoles',
    name: 'ManageRoles',
    component: ManageRoles,
  },
  {
    path: '/infosVg/:id',
    name: 'InfosVg',
    component: () => import('@/page/VGs/infosVg.vue'),
    props: true,
  },
  {
    path: '/createVg',
    name: 'CreateVG',
    component: CreateVG,
  },
  {
    path: '/vg/:id',
    name: 'vgPage',
    component: () => import('@/page/VGs/HomePage.vue'),
    props: route => ({
      id: route.params.id,
      vg: history.state.vg   // 👈 récupération automatique
    })
  },
]

// 👉 on crée le router dans une variable
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 👉 middleware d’authentification
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // routes accessibles sans être connecté
  const publicPages = ['login', 'register']

  // si l'utilisateur n'est pas connecté et essaye une page protégée → redirect
  if (!token && !publicPages.includes(to.name)) {
    return next('/login')
  }

  next()
})

export default router
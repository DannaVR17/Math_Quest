import { createRouter, createWebHistory } from 'vue-router';
import HomeMath from '../components/HomeMath.vue';
import LoginPage from '../components/LoginPage.vue';
import RegisterUser from '../components/RegisterUser.vue';
import UserView from '../components/UserView.vue';
import TopicDetailView from '../components/TopicDetailView.vue';
import MatchQuestionsView from '@/components/MatchQuestionsView.vue';

const routes = [
  { path: '/', component: HomeMath, name: 'Home' }, // Página principal
  { path: '/login', component: LoginPage, name: 'Login' }, // Página de inicio de sesión
  { path: '/register', component: RegisterUser, name: 'Register' }, // Página de registro
  { 
    path: '/user', component: UserView, name: 'User', 
    meta: { requiresAuth: true }, // Solo accesible si está autenticado
  },
  { 
    path: '/topic/:_id', component: TopicDetailView, name: 'TopicDetailView', 
    meta: { requiresAuth: true }, // Requiere autenticación
  },
  { path: '/match', component: MatchQuestionsView, name: 'MatchQuestions', meta: { requiresAuth: true } },
  {
    path: "/quiz/:topicId",
    name: "MatchQuestions",
    component: MatchQuestionsView,
},

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Simulación de autenticación
const isAuthenticated = true; // Cambia esto según tu lógica

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' }); // Redirige al login si no está autenticado
  } else {
    next();
  }
});

export default router;

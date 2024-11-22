<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="loginUser">
      <div class="mb-3">
        <label for="username" class="form-label">Usuario</label>
        <input type="text" v-model="username" class="form-control" placeholder="Ingresa tu usuario" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input type="password" v-model="password" class="form-control" placeholder="Ingresa tu contraseña" />
      </div>
      <button type="submit" class="btn btn-primary w-100 mb-2">Iniciar Sesión</button>
    </form>
    <router-link to="/register">¿No tienes cuenta? Regístrate</router-link>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import api from '../services/api';

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async loginUser() {
      try {
        const response = await api.post("/auth/login", { username: this.username, password: this.password })

        const data = response.data;

        if (response.status === 200) {
          localStorage.setItem("token", data.token); // Guarda el token en localStorage
          localStorage.setItem("username", data.user.username); // Guarda el usuario
          localStorage.setItem("userId", data.user._id); // Guarda el usuario
          alert("Inicio de sesión exitoso");
          this.router.push('/user'); // Redirige a la página de usuario
        } else {
          alert(data.message || "Error al iniciar sesión");
        }
      } catch (error) {
        alert("Hubo un problema con el servidor.");
      }
    },
  },
};
</script>

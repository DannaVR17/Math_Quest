<template>
  <div class="login-container">
    <button class="btn btn-secondary small-btn back-btn" @click="goBack">Volver</button>
    <div class="form-wrapper">
      <h2>Iniciar Sesión</h2>
      <form class="form-container" @submit.prevent="loginUser">
        <label for="username" class="form-label">Usuario</label>
        <input
          type="text"
          id="username"
          v-model="username"
          class="form-control"
          placeholder="Ingresa tu usuario"
        />
        <label for="password" class="form-label">Contraseña</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Ingresa tu contraseña"
        />
        <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
      </form>
      <router-link to="/register" class="register-link">
        ¿No tienes cuenta? Regístrate
      </router-link>
    </div>
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
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

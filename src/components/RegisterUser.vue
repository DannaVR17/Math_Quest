<template>
  <div class="register-container">
    <h2>Registrarse</h2>
      <form @submit.prevent="registerUser">
        <div class="mb-3">
          <label for="username" class="form-label">Usuario</label>
          <input type="text" v-model="username" class="form-control" placeholder="Crea tu usuario" />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" v-model="password" class="form-control" placeholder="Crea tu contraseña" />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">email</label>
          <input type="email" v-model="email" class="form-control" placeholder="Ingresa tu correo" />
        </div>
        <button type="submit" class="btn btn-primary w-100">Registrarse</button>
      </form>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        username: "",
        password: "",
        email: "",
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: this.username,
              password: this.password,
              email: this.email,
            }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            alert("Usuario registrado exitosamente");
            this.$router.push("/login"); // Redirige al login después del registro
          } else {
            alert(data.message || "Error al registrarse");
          }
        } catch (error) {
          alert("Hubo un problema con el servidor.");
        }
      },
    },
  };
  </script>
  
<template>
  <div class="register-container">
    <button class="btn btn-secondary small-btn back-btn" @click="goBack">Volver</button>
    <h2>Registrarse</h2>
    <form class="form-container" @submit.prevent="registerUser">
      <label for="username" class="form-label">Usuario</label>
      <input
        type="text"
        id="username"
        v-model="username"
        class="form-control"
        placeholder="Crea tu usuario"
      />

      <label for="email" class="form-label">Email</label>
      <input
        type="email"
        id="email"
        v-model="email"
        class="form-control"
        placeholder="Ingresa tu correo"
      />

      <label for="password" class="form-label">Contraseña</label>
      <input
        type="password"
        id="password"
        v-model="password"
        class="form-control"
        placeholder="Crea tu contraseña"
      />

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
      goBack() {
      this.$router.go(-1); // Vuelve a la vista anterior
    },
    },
  };
  </script>
  
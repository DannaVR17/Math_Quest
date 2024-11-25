<template>
  <div class="home-container">
    <header class="header">
      <h1>Math Quest</h1>
      <p>“Descubre el poder de las matemáticas mientras aprendes de manera divertida.”</p>
    </header>
    <div class="buttons-container">
      <router-link to="/login" class="btn btn-primary">Iniciar sesión</router-link>
      <router-link to="/register" class="btn btn-secondary">Registrarse</router-link>
    </div>
  </div>
</template>


<script>
export default {
  name: "HomeMath",
};
</script>


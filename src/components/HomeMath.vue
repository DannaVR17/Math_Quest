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

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  background: linear-gradient(135deg, #4caf50, #2196f3);
  color: #fff;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.header p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.buttons-container {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  color: #fff;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #2196f3;
}

.btn-primary:hover {
  background-color: #1976d2;
}

.btn-secondary {
  background-color: #4caf50;
}

.btn-secondary:hover {
  background-color: #388e3c;
}
</style>

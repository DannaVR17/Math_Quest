export default {
    isAuthenticated: false, // Cambia esto al iniciar sesión correctamente
    authenticate() {
      this.isAuthenticated = true;
    },
    logout() {
      this.isAuthenticated = false;
    },
  };
  
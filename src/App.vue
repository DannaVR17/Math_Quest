<template>
  <div id="app">
    <router-view />
    <MatchInvitation />
  </div>
</template>

<script>
import MatchInvitation from "./components/MatchInvitation.vue";
export default {
  name: "App",
  components: { MatchInvitation },
};
</script>

<style>
/* Opcional: estilos globales */
body {
  margin: 0;
  font-family: "Roboto", sans-serif;
}
</style>

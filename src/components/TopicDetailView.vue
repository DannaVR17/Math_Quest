<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar">
      <button class="btn btn-secondary small-btn back-btn" @click="goBack">Volver</button>
      <div class="user-info">
        <img
          src="../assets/foto1.jpg"
          alt="Foto de perfil del usuario"
          class="profile-picture"
        />
        <span>{{ user.name }}</span>
      </div>
    </nav>

    <!-- Content -->
    <div class="container content mt-4" v-if="topic">
      <h2 class="text-primary">{{ topic.category }}</h2>
      <h3 class="text-secondary">{{ topic.name }}</h3>
      <p>{{ topic.studyContent }}</p>
      <div class="text-end mt-3">
        <button class="btn btn-success" @click="goToMatch">Responder quiz</button>
      </div>
    </div>

    <div v-else class="text-center mt-5">
      <p>Cargando tema...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TopicDetailView",
  data() {
    return {
      topic: null, // Cambiado para evitar errores iniciales
      user: { name: localStorage.getItem("username") }, // Cargar el nombre del usuario
    };
  },
  methods: {
    async fetchTopics() {
      try {
        const topicId = this.$route.params._id;
        const response = await axios.get(`http://localhost:5000/api/topics/${topicId}`);
        this.topic = response.data;
      } catch (error) {
        console.error("Error al obtener los temas:", error);
      }
    },
    goToMatch() {
    this.$router.push({ name: "MatchQuestions", params: { topicId: this.topic._id } });
},
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.fetchTopics();
  },
};
</script>
<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg" style="background-color: #00796b;">
      <div class="container-fluid">
        <a class="navbar-brand text-white" href="#">
          Math Quest
        </a>
        <div class="collapse navbar-collapse justify-content-end">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link user-info text-white" href="#">
                <img
                  src="https://storage.googleapis.com/a1aa/image/5ZN1JBkF4f2wIqZeL6h44TlOaFedFrPRITYYnfInfpmPfW28E.jpg"
                  alt="Foto de perfil del usuario" class="rounded-circle me-2" width="40" height="40" />
                <span>NombreUsuario</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="container content mt-4" v-if="topic && topic.name">
      <h2 class="text-center text-primary">{{ topic.category }}</h2>
      <h3 class="text-secondary">{{ topic.name }}</h3>
      <p>
      {{ topic.studyContent }}
      </p>

      <div class="text-end mt-3">
        <button class="btn btn-success" @click="goToQuiz">Responder Quiz</button>
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
      topic:{},
    };
  },

  methods: {
    async fetchTopics() {
      try {
        const topicId = this.$route.params._id;
        const response = await axios.get(`http://localhost:5000/api/topics/${topicId}`);
        this.topic = response.data; // Asignar los datos a la lista
        console.log(response.data);
        
      } catch (error) {
        console.error("Error al obtener los temas:", error);
      }
    },
    goToQuiz() {
      this.$router.push("/quiz");
    },
  },
  mounted() {
    this.fetchTopics(); // Llamamos al método cuando el componente se monta
  },
};
</script>


<style>
body {
  background-color: #e0f7fa;
  color: #004d40;
}

.navbar-brand,
.nav-link,
.user-info {
  color: #ffffff !important;
}

.content {
  margin-top: 20px;
}
</style>
<template>
  <div class="container my-4">
    <!-- Header -->
    <div class="header-container">
      <div class="user-info">
        <img src="../assets/foto1.jpg" alt="User profile picture" class="profile-picture" />
        <h2>{{ user.name }}</h2>
      </div>
      <div class="header-buttons">
        <button class="btn btn-primary small-btn" @click="openNotifications">Notificaciones</button>
        <button class="btn btn-danger small-btn" @click="logout">Cerrar Sesión</button>
      </div>
    </div>

    <!-- Modal de Notificaciones -->
    <div v-if="showNotifications" class="modal fade show" tabindex="-1" aria-modal="true" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Invitaciones Recibidas</h5>
            <button type="button" class="btn-close" @click="closeNotifications"></button>
          </div>
          <div class="modal-body">
            <ul v-if="invitations.length > 0" class="list-group">
              <li v-for="invitation in invitations" :key="invitation._id" class="list-group-item">
                <div>
                  <p>Invitación de: <strong>{{ invitation.sender.username }}</strong></p>
                  <p>Estatus: {{ invitation.status }}</p>
                </div>
                <div>
                  <button class="btn btn-primary small-btn" @click="acceptInvitation(invitation)">Aceptar</button>
                  <button class="btn btn-danger small-btn" @click="declineInvitation(invitation)">Rechazar</button>
                </div>
              </li>
            </ul>
            <p v-else>No tienes nuevas invitaciones.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary small-btn" @click="closeNotifications">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="search-bar mt-4">
      <h3 class="h4">Temas a Estudiar</h3>
      <input type="text" placeholder="Buscar temas..." v-model="searchQuery" @input="searchTopics" />
    </div>

    <!-- Topics -->
    <div class="row mt-4">
      <div v-for="topic in filteredTopics" :key="topic._id" class="col-md-4 col-sm-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ topic.category }}</h5>
            <p class="card-text">{{ topic.description }}</p>
            <button class="btn btn-primary small-btn mt-2" @click="goToTopic(topic._id)">Ver Detalle</button>
          </div>
        </div>
      </div>
      <div v-if="filteredTopics.length === 0" class="col-12 text-center">
        <p class="text-muted">No se ha encontrado el tema</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer d-flex justify-content-between align-items-center mt-4">

      <button class="btn btn-secondary small-btn" @click="createMatch">Crear desafío</button>
      <div class="ranking-box">
        <h3>Ranking Global</h3>
        <ul class="list-group">
          <li v-for="(rank, index) in ranking" :key="rank.user._id"
            class="list-group-item d-flex justify-content-between align-items-center">
            <span>
              #{{ index + 1 }} {{ rank.user.username }}
            </span>
            <span>{{ rank.totalScore }} puntos</span>
          </li>
        </ul>
        <p v-if="ranking.length === 0" class="text-muted">No hay usuarios en el ranking aún.</p>

      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import matchStore from "../store/matchStore";

export default {
  name: "UserView",
  data() {
    return {
      user: {},
      searchQuery: "",
      topics: [],
      filteredTopics: [],
      showNotifications: false,
      invitations: [],
      ranking: []
    };
  },
  created() {
    const username = localStorage.getItem("username");
    this.user = {
      id: 1,
      name: username, // Aquí se cargará el nombre del usuario
    };
  },
  methods: {
    openNotifications() {
      this.showNotifications = true; // Mostrar la modal de notificaciones
      this.fetchInvitations(); // Obtener las invitaciones
    },
    closeNotifications() {
      this.showNotifications = false; // Cerrar la modal
    },
    async fetchInvitations() {
      try {
        const userId = localStorage.getItem("userId");
        const response = await api.get(`/invitation/${userId}`);
        this.invitations = response.data;
      } catch (error) {
        console.error("Error al obtener las invitaciones:", error);
      }
    },
    acceptInvitation(invitation) {
      console.log(`Aceptando invitación con ID: ${invitation}`);
      // Aquí puedes llamar al método de aceptar invitación en matchStore o realizar una solicitud a la API
    },
    declineInvitation(invitation) {
      console.log(`Rechazando invitación con ID: ${invitation}`);
      // Aquí puedes manejar la lógica de rechazo
    },
    createMatch() {
      matchStore.createMatch();
    },
    async fetchTopics() {
      try {
        const response = await api.get("/topics");
        this.topics = response.data; // Asignar los datos a la lista
        this.filteredTopics = this.topics;
      } catch (error) {
        console.error("Error al obtener los temas:", error);
      }
    },
    searchTopics() {
      if (this.searchQuery.trim() === "") {
        this.filteredTopics = this.topics;
      } else {
        this.filteredTopics = this.topics.filter(topic =>
          topic.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    },
    async logout() {
      const username = localStorage.getItem("username");
      const response = await api.post(`/auth/logout`, { username });
      if (response && response.data && response.data.message) this.$router.push("/"); // Redirige al inicio
    },
    goToTopic(topicId) {
      this.$router.push({ name: "TopicDetailView", params: { _id: topicId } });
    },
    async fetchRanking() {
      try {
        const response = await api.get("/score");
        this.ranking = response.data.map((rank) => ({
          user: rank.user,
          totalScore: rank.totalScore,
        }));
      } catch (error) {
        console.error("Error al obtener el ranking:", error);
      }
    },
  },
  mounted() {
    this.fetchTopics(); // Llamamos al método cuando el componente se monta
    this.fetchRanking();
  },
};
</script>
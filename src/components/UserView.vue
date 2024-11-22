<template>
  <div class="container my-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center p-3 rounded shadow-sm"
      style="background: rgba(255, 255, 255, 0.5);">
      <div class="d-flex align-items-center">
        <img src="../assets/foto1.jpg" alt="User profile picture" class="rounded-circle me-3"
          style="width: 50px; height: 50px;" />
        <h2 class="h5 mb-0 text-primary">{{ user.name }}</h2>
      </div>
      <div>
        <button class="btn btn-primary me-2" @click="openNotifications">Notificaciones</button>
        <button class="btn btn-danger" @click="logout">Cerrar Sesión</button>
      </div>
    </div>

    <!-- Modal de Notificaciones -->
    <div v-if="showNotifications" class="modal fade show" tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.5);" aria-modal="true" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Invitaciones Recibidas</h5>
            <button type="button" class="btn-close" @click="closeNotifications"></button>
          </div>
          <div class="modal-body">
            <ul v-if="invitations.length > 0" class="list-group">
              <li v-for="invitation in invitations" :key="invitation._id"
                class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <p>Invitación de: <strong>{{ invitation.sender.username }}</strong></p>
                  <p>Estatus: {{ invitation.status }}</p>
                </div>
                <div>
                  <button class="btn btn-success me-2" @click="acceptInvitation(invitation)">Aceptar</button>
                  <button class="btn btn-danger" @click="declineInvitation(invitation)">Rechazar</button>
                </div>
              </li>
            </ul>
            <p v-else>No tienes nuevas invitaciones.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeNotifications">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Fondo oscuro del modal -->
    <div v-if="showNotifications" class="modal-backdrop fade show"></div>

    <!-- Search Bar -->
    <div class="d-flex justify-content-between align-items-center mt-4">
      <h3 class="h4 text-secondary">Temas a Estudiar</h3>
      <input type="text" class="form-control w-50" placeholder="Buscar temas..." v-model="searchQuery"
        @input="searchTopics" />
    </div>
    <!-- Topics -->
    <div class="row mt-4">
      <div v-for="topic in filteredTopics" :key="topic._id" class="col-md-4 col-sm-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title text-success">{{ topic.name }}</h5>
            <p class="card-text text-muted">{{ topic.description }}</p>
            <button class="btn btn-primary mt-2" @click="goToTopic(topic._id)">
              Ver Detalle
            </button>
          </div>
        </div>
      </div>
      <div v-if="filteredTopics.length === 0" class="col-12 text-center mt-4">
        <p class="text-muted">No se ha encontrado el tema</p>
      </div>
    </div>
    <!-- Footer -->
    <div class="d-flex justify-content-between align-items-center mt-4">
      <button class="btn btn-primary" @click="goToMatch">Hacer quiz</button>
      <button class="btn btn-success" @click="createMatch">Crear desafio</button>
      <div class="bg-light p-3 rounded shadow-sm text-center" style="width: 30%;">
        <h5 class="text-success">Ranking</h5>
        <p class="text-muted mb-0">Tu posición actual: #1</p>
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
    goToMatch() {
      this.$router.push({ name: "MatchQuestions" });
    },

  },
  mounted() {
    this.fetchTopics(); // Llamamos al método cuando el componente se monta
  },
};
</script>
<template>
    <div>
      <!-- Modal -->
      <div
        v-if="showModal"
        class="modal fade show"
        tabindex="-1"
        style="display: block; background: rgba(0, 0, 0, 0.5);"
        aria-modal="true"
        role="dialog"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">¡Nueva Invitación!</h5>
              <button type="button" class="btn-close" @click="declineInvitation"></button>
            </div>
            <div class="modal-body">
              <p>Has recibido una invitación para jugar de <strong>{{ invitation.senderName }}</strong>.</p>
              <p>¿Deseas aceptar?</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="declineInvitation">Rechazar</button>
              <button class="btn btn-primary" @click="acceptInvitation">Aceptar</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Fondo oscuro del modal -->
      <div v-if="showModal" class="modal-backdrop fade show"></div>
    </div>
  </template>
  
  <script>
import matchStore from "../store/matchStore";

export default {
  data() {
    return {
      showModal: false, // Controla la visibilidad de la modal
      invitation: null, // Contiene los datos de la invitación
    };
  },
  computed: {
    isInMatch() {
      return matchStore.currentMatch !== null; // Verifica si ya estás en una partida
    },
  },
  methods: {
    handleInvitation(invitation) {
      if (this.isInMatch) {
        console.log("Ya estás en una partida. Invitación ignorada.");
        return;
      }
      this.invitation = invitation;
      this.showModal = true; // Mostrar la modal
    },
    acceptInvitation() {
      if (this.invitation) {
        matchStore.acceptInvitation(this.invitation);
        this.showModal = false; // Cierra la modal
      }
    },
    declineInvitation() {
      this.showModal = false; // Cierra la modal
      this.invitation = null; // Limpia la invitación actual
    },
  },
  mounted() {
    // Escuchar el evento de invitación
    matchStore.socket.on("receive-invitation", (invitation) => {
      console.log("Nueva invitación recibida:", invitation);
      this.handleInvitation(invitation); // Manejar la invitación
    });
  },
  beforeUnmount() {
    // Desconectar el evento cuando se desmonte el componente
    matchStore.socket.off("receive-invitation");
  },
};
</script>
  <style scoped>
  .modal {
    z-index: 1050;
  }
  
  .modal-backdrop {
    z-index: 1040;
  }
  </style>
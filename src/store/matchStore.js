import { reactive } from "vue";
import socket from "../sockets/socketInstance";


const matchStore = reactive({
  socket,
  invitations: [], // Invitaciones recibidas
  currentMatch: null, // Datos de la partida actual
  ranking: [], // Lista del ranking

  // Enviar invitación
  sendInvitation(receiverId) {
    socket.emit("send-invitation", {
      sender: localStorage.getItem("userId"), // ID del usuario actual
      receiver: receiverId,
    });
  },

  registerUser(userId) {
    socket.emit("register", userId); // Registrar el userId con el socket
  },

  async createMatch(senderId) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/matches/create-with-logged-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sender: senderId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Error creating match:", error.message);
        return;
      }

      const data = await response.json();
      console.log("Match created:", data);

      // Actualizar invitaciones
      this.invitations.push(data.invitation);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  },

  // Aceptar invitación
  acceptInvitation(invitation) {
    this.currentMatch = invitation.match; // Actualiza el estado de la partida actual
    socket.emit("accept-invitation", {
      matchId: invitation.matchId,
      players: invitation.players,
    });
  },

  // Registrar respuesta
  submitAnswer(questionId, answer, responseTime) {
    socket.emit("submit-answer", {
      matchId: this.currentMatch.matchId,
      playerId: localStorage.getItem("userId"),
      questionId,
      answer,
      responseTime,
    });
  },

  // Actualizar ranking
  fetchRanking() {
    socket.emit("get-ranking");
  },
});

socket.on("receive-invitation", (invitation) => {
  matchStore.invitations.push(invitation);
});

socket.on("start-game", (match) => {
  matchStore.currentMatch = match;
});

socket.on("update-ranking", (ranking) => {
  matchStore.ranking = ranking;
});

export default matchStore;

import { reactive } from "vue";
import socket from "../sockets/socketInstance";
import api from "@/services/api";

const matchStore = reactive({
  socket,
  userId: localStorage.getItem("userId"),
  invitations: [],
  currentMatch: null,
  ranking: [],

  sendInvitation(receiverId) {
    socket.emit("send-invitation", {
      sender: this.userId,
      receiver: receiverId,
    });
  },

  registerUser(userId) {
    this.userId = userId;
    socket.emit("register", userId);
  },

  async createMatch() {
    try {
      const response = await api.post("/matches/create-with-logged-user", { sender: this.userId });
      console.log("Match created:", response.data);

      this.invitations.push(response.data.invitation);
    } catch (error) {
      console.error("Error creating match:", error.response?.data || error.message);
    }
  },

  acceptInvitation(invitation) {
    this.currentMatch = invitation.match;
    socket.emit("accept-invitation", {
      matchId: invitation.matchId,
      players: invitation.players,
    });
  },

  submitAnswer(questionId, answer, responseTime) {
    socket.emit("submit-answer", {
      matchId: this.currentMatch.matchId,
      playerId: this.userId,
      questionId,
      answer,
      responseTime,
    });
  },

  fetchRanking() {
    socket.emit("get-ranking");
  },
});

function initializeSocketListeners() {
  socket.on("receive-invitation", (invitation) => {
    matchStore.invitations.push(invitation);
  });

  socket.on("start-game", (match) => {
    matchStore.currentMatch = match;
  });

  socket.on("update-ranking", (ranking) => {
    matchStore.ranking = ranking;
  });
}

// Inicializar los eventos de socket
initializeSocketListeners();

export default matchStore;

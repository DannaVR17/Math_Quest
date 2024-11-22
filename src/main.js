import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/global.css';
import 'bootstrap/dist/css/bootstrap.css';
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import matchStore from "./store/matchStore";

const app = createApp(App);
app.use(router);

const socket = io("http://localhost:5000"); // URL del backend

socket.on("connect", () => {
    console.log("Conectado al servidor Socket.IO:", socket.id);
});

const userId = localStorage.getItem("userId"); // Obtén el userId almacenado
if (userId) {
    matchStore.registerUser(userId); // Registrar el usuario con el socket
}

app.mount("#app");

export default socket;
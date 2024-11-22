import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Reemplaza con la URL de tu backend

socket.on("connect", () => {
    console.log(`Conectado a Socket.IO con ID: ${socket.id}`);
});

socket.on("disconnect", () => {
    console.log("Desconectado de Socket.IO");
});

export default socket;
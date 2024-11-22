<template>
    <div class="container my-4 p-4 bg-white rounded shadow-lg">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center">
                <img src="https://storage.googleapis.com/a1aa/image/98jcFbi7lj6YA1fJOkNUAFV3UmTxjNzuYC4TLg8qAgKzZX5JA.jpg"
                    alt="User profile picture" class="rounded-circle me-3" style="width: 50px; height: 50px;" />
                <h2 class="text-primary">{{ user.name }}</h2>
            </div>
            <div class="text-danger fw-bold">
                <i class="fas fa-clock"></i>
                <span id="timer">{{ timerDisplay }}</span>
            </div>
        </div>

        <!-- Question -->
        <div v-if="currentQuestion" class="mb-4">
            <h3 class="h5 text-secondary">{{ currentQuestion.content }}</h3>
        </div>

        <!-- Options -->
        <div v-if="currentQuestion" class="d-grid gap-2">
            <button v-for="(option, index) in currentQuestion.options" :key="index" class="btn btn-primary"
                @click="selectAnswer(option)">
                {{ option }}
            </button>
            <!-- Buttons for True/False -->
            <button v-if="currentQuestion.type === 'verdadero/falso'" class="btn btn-success"
                @click="selectAnswer('Verdadero')">
                Verdadero
            </button>
            <button v-if="currentQuestion.type === 'verdadero/falso'" class="btn btn-danger"
                @click="selectAnswer('Falso')">
                Falso
            </button>
        </div>

        <!-- Feedback -->
        <div v-if="feedbackMessage" class="mt-4 alert" :class="feedbackClass">
            {{ feedbackMessage }}
        </div>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    name: "MatchQuestionsView",
    data() {
        const username = localStorage.getItem("username");
        return {
            user: { name: username }, // Simulado, cámbialo según tu lógica
            questions: [],
            currentQuestionIndex: 0,
            currentQuestion: null,
            feedbackMessage: "",
            feedbackClass: "",
            timer: 30,
        };
    },
    computed: {
        timerDisplay() {
            return `00:${this.timer < 10 ? "0" + this.timer : this.timer}`;
        },
    },
    methods: {
        async fetchQuestions() {
            try {
                const response = await api.get("/questions");
                this.questions = response.data; // Asignar las preguntas del backend
                this.currentQuestion = this.questions[this.currentQuestionIndex];
                
                this.startTimer();
            } catch (error) {
                console.error("Error al obtener las preguntas:", error);
            }
        },
        startTimer() {
            const countdown = setInterval(() => {
                this.timer--;
                if (this.timer <= 0) {
                    clearInterval(countdown);
                    this.handleTimeout();
                }
            }, 1000);
        },
        handleTimeout() {
            this.feedbackMessage = "¡Tiempo agotado!";
            this.feedbackClass = "alert-danger";
            this.goToNextQuestion();
        },
        selectAnswer(option) {
            if (option === this.currentQuestion.correctAnswer) {
                this.feedbackMessage = "¡Respuesta correcta!";
                this.feedbackClass = "alert-success";
            } else {
                this.feedbackMessage = "Respuesta incorrecta.";
                this.feedbackClass = "alert-danger";
            }
            setTimeout(() => this.goToNextQuestion(), 2000); // Mostrar feedback antes de avanzar
        },
        goToNextQuestion() {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.questions.length) {
                this.currentQuestion = this.questions[this.currentQuestionIndex];
                this.feedbackMessage = "";
                this.timer = 30; // Reiniciar el temporizador
                this.startTimer();
            } else {
                this.feedbackMessage = "¡Has completado todas las preguntas!";
                this.feedbackClass = "alert-success";
                this.currentQuestion = null;
            }
        },
    },
    mounted() {
        this.fetchQuestions(); // Obtener preguntas al montar el componente
    },
};
</script>

<style>
body {
    font-family: "Roboto", sans-serif;
}
</style>
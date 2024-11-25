<template>
    <div class="container my-4 p-4 bg-white rounded shadow-lg">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <button class="btn btn-secondary small-btn back-btn" @click="goBack">Volver</button>
            <div class="d-flex align-items-center">
                <img src="../assets/foto1.jpg" alt="User profile picture" class="rounded-circle me-3"
                    style="width: 50px; height: 50px;" />
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
        </div>

        <!-- Feedback -->
        <div v-if="feedbackMessage" class="mt-4 alert" :class="feedbackClass">
            {{ feedbackMessage }}
        </div>

        <!-- Botón para la siguiente pregunta -->
        <button v-if="(currentQuestion && feedbackMessage) && showButton" class="btn btn-secondary mt-4"
            @click="goToNextQuestion">
            Siguiente pregunta
        </button>

        <!-- Resultados finales -->
        <div v-if="isQuizFinished" class="text-center mt-4">
            <h3 class="text-primary">¡Cuestionario finalizado!</h3>
            <p class="fw-bold">Tu puntuación: {{ correctAnswers }} / {{ questions.length }}</p>
            <p class="text-muted">
                {{ correctAnswers === questions.length ? "¡Excelente trabajo!" : "Sigue practicando, puedes mejorar." }}
            </p>
        </div>
    </div>
</template>


<script>
import api from "../services/api";

export default {
    name: "MatchQuestionsView",
    data() {
        const username = localStorage.getItem("username");
        return {
            user: { name: username },
            questions: [],
            currentQuestionIndex: 0,
            currentQuestion: null,
            feedbackMessage: "",
            feedbackClass: "",
            timer: 30,
            correctAnswers: 0,
            quizFinished: false,
            showButton: true,
            timerInterval: null, // Referencia para el temporizador
            scoreSubmitted: false, // Evitar múltiples envíos de puntuación
        };
    },
    computed: {
        timerDisplay() {
            return `00:${this.timer < 10 ? "0" + this.timer : this.timer}`;
        },
        isQuizFinished() {
            return this.quizFinished;
        },
    },
    methods: {
        async fetchQuestions() {
            try {
                const topicId = this.$route.params.topicId;
                const response = await api.get(`/questions/topic/${topicId}`);
                if (response.data.message) {
                    this.feedbackMessage = response.data.message;
                    this.feedbackClass = "alert-warning";
                    return;
                }
                this.questions = response.data;
                this.loadCurrentQuestion();
            } catch (error) {
                console.error("Error al obtener las preguntas:", error);
            }
        },
        loadCurrentQuestion() {
            // Detener cualquier temporizador existente
            this.clearTimer();

            if (this.currentQuestionIndex < this.questions.length) {
                this.currentQuestion = this.questions[this.currentQuestionIndex];
                this.timer = this.currentQuestion.timeLimit || 30;
                this.feedbackMessage = "";
                this.feedbackClass = "";
                this.startTimer();
            } else {
                this.quizFinished = true;
                this.currentQuestion = null;

                // Enviar puntuación al finalizar todas las preguntas, si no se ha enviado antes
                if (!this.scoreSubmitted) {
                    this.submitScore();
                }
            }
        },
        startTimer() {
            this.timerInterval = setInterval(() => {
                this.timer--;
                if (this.timer <= 0) {
                    this.clearTimer();
                    this.handleTimeout();
                }
            }, 1000);
        },
        clearTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        },
        handleTimeout() {
            this.feedbackMessage = "¡Tiempo agotado!";
            this.feedbackClass = "alert-danger";

            setTimeout(() => {
                if (this.currentQuestionIndex < this.questions.length - 1) {
                    this.goToNextQuestion();
                } else if (!this.quizFinished) {
                    this.quizFinished = true;
                    this.submitScore(); // Enviar puntuación al finalizar
                }
            }, 2000);
        },
        selectAnswer(option) {
            this.clearTimer();

            if (option === this.currentQuestion.correctAnswer) {
                this.feedbackMessage = "¡Respuesta correcta!";
                this.feedbackClass = "alert-success";
                this.correctAnswers++;
            } else {
                this.feedbackMessage = "Respuesta incorrecta.";
                this.feedbackClass = "alert-danger";
            }

            // Mostrar botón de siguiente pregunta
            this.showButton = true;
        },
        async submitScore() {
            if (this.scoreSubmitted) return; // Evitar múltiples envíos
            this.scoreSubmitted = true;

            try {
                const topicId = this.$route.params.topicId;
                const userId = localStorage.getItem("userId");

                const response = await api.post("/score", {
                    userId,
                    topicId,
                    score: this.correctAnswers,
                });

                console.log("Puntuación registrada correctamente:", response.data.message || "OK");
            } catch (error) {
                console.error("Error al enviar la puntuación:", error);
            }
        },
        goToNextQuestion() {
            this.currentQuestionIndex++;
            this.showButton = false;
            this.loadCurrentQuestion();
        },
        goBack() {
            this.$router.push("/user");
        },
    },
    mounted() {
        this.fetchQuestions();
    },
    beforeUnmount() {
        // Limpiar temporizador al desmontar el componente
        this.clearTimer();
    },
};
</script>


<style>
body {
    font-family: "Roboto", sans-serif;
}
</style>
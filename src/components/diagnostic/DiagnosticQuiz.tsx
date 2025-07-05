"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Welcome from "./Welcome";
import QuestionStep, { Question } from "./QuestionStep";
import SnapshotResult from "./SnapshotResult";
import ContactForm, { ContactInfo } from "./ContactForm";
import FullResult from "./FullResult";

// Define los tipos de datos necesarios
const questions: Question[] = [
  {
    id: 1,
    question: "¿En qué etapa de analítica de datos se encuentra tu empresa?",
    options: [
      {
        text: "Nivel Inicial",
        value: "inicial",
        description: "Datos dispersos o poco organizados",
      },
      {
        text: "Nivel Intermedio",
        value: "intermedio",
        description: "Datos organizados pero no optimizados",
      },
      {
        text: "Nivel Avanzado",
        value: "avanzado",
        description: "Datos organizados buscando mejorar",
      },
    ],
  },
  {
    id: 2,
    question: "¿Cómo toma actualmente decisiones importantes en su negocio?",
    options: [
      {
        text: "Intuición",
        value: "intuicion",
        description: "Basadas en experiencia o corazonadas",
      },
      {
        text: "Datos básicos",
        value: "datos_basicos",
        description: "Consulta de informes simples",
      },
      {
        text: "Análisis estructurado",
        value: "analisis",
        description: "Proceso formal de análisis de datos",
      },
    ],
  },
  {
    id: 3,
    question: "¿Cuál es tu principal desafío con los datos de tu negocio?",
    options: [
      {
        text: "Recopilación",
        value: "recopilacion",
        description: "Obtener y centralizar información",
      },
      {
        text: "Organización",
        value: "organizacion",
        description: "Estructurar datos para su análisis",
      },
      {
        text: "Interpretación",
        value: "interpretacion",
        description: "Extraer insights accionables",
      },
    ],
  },
];

// Tipos de pasos del quiz
type QuizStage = "welcome" | "questions" | "snapshot" | "contact" | "result";

// Estados del procesamiento de diagnóstico
type DiagnosticStatus = "idle" | "sending" | "success" | "error";

interface DiagnosticState {
  status: DiagnosticStatus;
  message: string;
}

const DiagnosticQuiz = () => {
  // Estados para manejar el quiz
  const [stage, setStage] = useState<QuizStage>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [diagnosticState, setDiagnosticState] = useState<DiagnosticState>({
    status: "idle",
    message: "",
  });

  // Inicializar tiempo de inicio cuando comience el quiz
  useEffect(() => {
    if (stage === "questions" && startTime === Date.now()) {
      setStartTime(Date.now());
    }
  }, [stage, startTime]);

  // Manejar selección de opción en las preguntas
  const handleOptionSelect = (value: string) => {
    // Guardar la respuesta
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }));

    // Si hay más preguntas, avanzar a la siguiente
    if (currentQuestion < questions.length) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // Si es la última pregunta, mostrar carga y avanzar al resultado parcial
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStage("snapshot");
      }, 1500);
    }
  };

  // Manejar retroceso a pregunta anterior
  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Función para enviar diagnóstico completo por email
  const sendDiagnosticEmail = async (contactData: ContactInfo) => {
    const completionTime = Math.round((Date.now() - startTime) / 1000); // en segundos

    const diagnosticData = {
      answers,
      score: getScore(),
      levelName: getLevelName(),
      contactInfo: contactData,
      completionTime,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/diagnostic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diagnosticData),
      });

      const result = await response.json();

      if (response.ok) {
        setDiagnosticState({
          status: "success",
          message: "Diagnóstico enviado exitosamente. Revisa tu email.",
        });

        // Tracking para analytics si está disponible
        if (typeof window !== "undefined" && "gtag" in window) {
          const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag;
          gtag("event", "diagnostic_completed", {
            event_category: "Diagnostic",
            event_label: getLevelName(),
            value: getScore(),
          });
        }

        return true;
      } else {
        setDiagnosticState({
          status: "error",
          message:
            result.error || "Error al enviar diagnóstico. Inténtalo de nuevo.",
        });
        return false;
      }
    } catch (error) {
      console.error("Error al enviar diagnóstico:", error);
      setDiagnosticState({
        status: "error",
        message:
          "Error de conexión. Verifica tu internet e inténtalo de nuevo.",
      });
      return false;
    }
  };

  // Manejar envío del formulario de contacto
  const handleContactSubmit = async (contactData: ContactInfo) => {
    setDiagnosticState({
      status: "sending",
      message: "Enviando diagnóstico...",
    });

    // Guardar contactInfo en estado
    setContactInfo(contactData);

    // Enviar diagnóstico por email
    const success = await sendDiagnosticEmail(contactData);

    if (success) {
      // Cambiar a pantalla de resultado final
      setTimeout(() => {
        setStage("result");
      }, 2000);
    }
  };

  // Resetear el quiz
  const resetQuiz = () => {
    setStage("welcome");
    setCurrentQuestion(1);
    setAnswers({});
    setLoading(false);
    setContactInfo(null);
    setStartTime(Date.now());
    setDiagnosticState({ status: "idle", message: "" });
  };

  // Funciones para calcular resultados
  const getScore = (): number => {
    const values = Object.values(answers);
    let score = 0;

    values.forEach((value) => {
      switch (value) {
        case "inicial":
        case "intuicion":
        case "recopilacion":
          score += 2;
          break;
        case "intermedio":
        case "datos_basicos":
        case "organizacion":
          score += 5;
          break;
        case "avanzado":
        case "analisis":
        case "interpretacion":
          score += 8;
          break;
      }
    });

    return Math.round((score / (values.length * 8)) * 10);
  };

  const getLevelName = (): string => {
    const score = getScore();
    if (score <= 3) return "Inicial";
    if (score <= 6) return "Intermedio";
    return "Avanzado";
  };

  const getSnapshotDescription = (): string => {
    const level = getLevelName();
    switch (level) {
      case "Inicial":
        return "Tu empresa está comenzando en el mundo del análisis de datos. Hay una gran oportunidad de crecimiento implementando procesos básicos de organización de datos.";
      case "Intermedio":
        return "Tu empresa tiene una base sólida en datos, pero hay oportunidades significativas para optimizar procesos y obtener insights más profundos.";
      case "Avanzado":
        return "Tu empresa está bien posicionada en analítica de datos. El enfoque debe estar en optimización avanzada y análisis predictivo.";
      default:
        return "Evaluación completada.";
    }
  };

  const getPrimaryOpportunity = (): string => {
    const level = getLevelName();
    switch (level) {
      case "Inicial":
        return "Implementar un sistema básico de recolección y organización de datos que te permita tomar decisiones más informadas.";
      case "Intermedio":
        return "Automatizar procesos de análisis y crear dashboards dinámicos para reducir tiempo de generación de reportes.";
      case "Avanzado":
        return "Desarrollar modelos predictivos que anticipen tendencias del mercado y optimicen la estrategia de negocio.";
      default:
        return "Evaluación completada.";
    }
  };

  const getOpportunityPercentage = (): number => {
    const level = getLevelName();
    switch (level) {
      case "Inicial":
        return 200;
      case "Intermedio":
        return 150;
      case "Avanzado":
        return 100;
      default:
        return 0;
    }
  };

  const getRecommendations = (): Array<{
    title: string;
    description: string;
  }> => {
    const level = getLevelName();
    switch (level) {
      case "Inicial":
        return [
          {
            title: "Auditoría de Datos",
            description:
              "Mapeo completo de fuentes de datos actuales y identificación de gaps críticos.",
          },
          {
            title: "Dashboard Básico",
            description:
              "Implementación de visualizaciones clave para KPIs principales del negocio.",
          },
          {
            title: "Procesos de Recolección",
            description:
              "Establecimiento de flujos estructurados para captura consistente de datos.",
          },
        ];
      case "Intermedio":
        return [
          {
            title: "Automatización de Reportes",
            description:
              "Eliminación de procesos manuales y creación de reportes automáticos.",
          },
          {
            title: "Integración de Sistemas",
            description:
              "Conexión de fuentes de datos para una vista unificada del negocio.",
          },
          {
            title: "Análisis Avanzado",
            description:
              "Implementación de métricas avanzadas y análisis de tendencias.",
          },
        ];
      case "Avanzado":
        return [
          {
            title: "Modelos Predictivos",
            description:
              "Desarrollo de algoritmos para anticipar comportamientos y tendencias.",
          },
          {
            title: "IA y Machine Learning",
            description:
              "Implementación de soluciones de inteligencia artificial para optimización.",
          },
          {
            title: "Estrategia Data-Driven",
            description:
              "Cultura organizacional basada completamente en datos y analytics.",
          },
        ];
      default:
        return [];
    }
  };

  // Obtener la pregunta actual de forma segura
  const getCurrentQuestion = (): Question | null => {
    const questionIndex = currentQuestion - 1;
    if (questionIndex >= 0 && questionIndex < questions.length) {
      return questions[questionIndex] ?? null;
    }
    return null;
  };

  const currentQuestionData: Question | null = getCurrentQuestion();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-umi-blue-dark mb-4"></div>
          <p className="text-gray-600">Analizando tus respuestas...</p>
        </div>
      )}

      {!loading && (
        <div>
          {/* Mostrar estado del diagnóstico si está en proceso */}
          {diagnosticState.status !== "idle" && (
            <div className="mb-6 p-4 rounded-lg border bg-white">
              <div className="flex items-center">
                {diagnosticState.status === "success" ? (
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : diagnosticState.status === "error" ? (
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <span className="text-sm font-medium">
                  {diagnosticState.message}
                </span>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {stage === "welcome" && (
              <Welcome onStart={() => setStage("questions")} />
            )}

            {stage === "questions" && currentQuestionData && (
              <QuestionStep
                question={currentQuestionData}
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
                selectedValue={answers[currentQuestion] || null}
                onSelect={handleOptionSelect}
                onPrevious={handlePrevious}
              />
            )}

            {stage === "snapshot" && (
              <SnapshotResult
                score={getScore()}
                levelName={getLevelName()}
                description={getSnapshotDescription()}
                primaryOpportunity={getPrimaryOpportunity()}
                opportunityPercentage={getOpportunityPercentage()}
                onContinue={() => setStage("contact")}
                onReset={resetQuiz}
              />
            )}

            {stage === "contact" && (
              <ContactForm
                onSubmit={handleContactSubmit}
                isLoading={diagnosticState.status === "sending"}
                {...(diagnosticState.status === "error" &&
                diagnosticState.message
                  ? { errorMessage: diagnosticState.message }
                  : {})}
              />
            )}

            {stage === "result" && contactInfo && (
              <FullResult
                title={`Tu estrategia personalizada: Nivel ${getLevelName()}`}
                description={getSnapshotDescription()}
                recommendationPoints={getRecommendations()}
                contactInfo={{
                  name: contactInfo.name,
                  email: contactInfo.email,
                }}
                onReset={resetQuiz}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default DiagnosticQuiz;

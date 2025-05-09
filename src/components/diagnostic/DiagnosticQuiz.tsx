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

const DiagnosticQuiz = () => {
  // Estados para manejar el quiz
  const [stage, setStage] = useState<QuizStage>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

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

  // Manejar envío del formulario de contacto
  const handleContactSubmit = (contactData: ContactInfo) => {
    setLoading(true);
    setContactInfo(contactData);

    // Simular procesamiento y avanzar al resultado final
    setTimeout(() => {
      setLoading(false);
      setStage("result");
    }, 1500);

    // En una implementación real, aquí enviarías los datos a un servidor/CRM
    console.log("Formulario enviado:", contactData);
  };

  // Reiniciar todo el quiz
  const resetQuiz = () => {
    setStage("welcome");
    setCurrentQuestion(1);
    setAnswers({});
    setContactInfo(null);
  };

  // Calcular puntuación para mostrar en el resultado
  const getScore = () => {
    // Lógica simplificada para calcular puntuación basada en respuestas
    let score = 0;

    if (answers[1] === "avanzado") score += 4;
    else if (answers[1] === "intermedio") score += 2;
    else score += 1;

    if (answers[2] === "analisis") score += 3;
    else if (answers[2] === "datos_basicos") score += 2;
    else score += 1;

    if (answers[3] === "interpretacion") score += 3;
    else if (answers[3] === "organizacion") score += 2;
    else score += 1;

    return score;
  };

  // Obtener nombre del nivel basado en puntuación
  const getLevelName = () => {
    const score = getScore();
    if (score >= 8) return "Avanzado";
    if (score >= 5) return "Intermedio";
    return "Inicial";
  };

  // Generar descripción para el resultado parcial
  const getSnapshotDescription = () => {
    const level = getLevelName();

    if (level === "Avanzado") {
      return "Tu organización está utilizando datos de manera efectiva, pero hay oportunidades para extraer aún más valor estratégico y ventajas competitivas.";
    } else if (level === "Intermedio") {
      return "Has establecido algunos procesos de análisis de datos, pero existen brechas importantes que limitan su potencial para impulsar decisiones estratégicas.";
    } else {
      return "Tu negocio está en las primeras etapas de aprovechamiento de datos. Establecer una base sólida ahora tendrá un impacto significativo en tu crecimiento futuro.";
    }
  };

  // Identificar la oportunidad principal
  const getPrimaryOpportunity = () => {
    if (answers[3] === "recopilacion") {
      return "Implementar un sistema centralizado de recopilación de datos que elimine los silos de información y permita una visión unificada del negocio.";
    } else if (answers[3] === "organizacion") {
      return "Estructurar tus datos existentes para facilitar análisis más profundos y descubrir patrones ocultos que impulsen la toma de decisiones.";
    } else {
      return "Desarrollar visualizaciones claras y frameworks de interpretación que conviertan tus datos en insights accionables para los tomadores de decisiones.";
    }
  };

  // Porcentaje de empresas similares con el mismo desafío
  const getOpportunityPercentage = () => {
    if (answers[3] === "recopilacion") return 68;
    if (answers[3] === "organizacion") return 75;
    return 82;
  };

  // Generar recomendaciones para el resultado completo
  const getRecommendations = () => {
    const level = getLevelName();
    const challengeType = answers[3];

    if (level === "Inicial") {
      if (challengeType === "recopilacion") {
        return [
          {
            title: "Implementar sistema básico de centralización",
            description:
              "Establece un repositorio central para tus datos clave utilizando herramientas accesibles como Google Sheets o Airtable como punto de partida.",
          },
          {
            title: "Auditar fuentes de datos existentes",
            description:
              "Identifica todas las fuentes de datos actuales y documenta qué información contiene cada una para crear un mapa completo de tus activos de datos.",
          },
          {
            title: "Establecer procesos de captura",
            description:
              "Define procesos simples pero consistentes para la captura regular de datos importantes, asignando responsables claros para cada área.",
          },
        ];
      } else if (challengeType === "organizacion") {
        return [
          {
            title: "Crear esquema de organización",
            description:
              "Desarrolla una estructura básica para clasificar y organizar tus datos, comenzando con las áreas de mayor impacto para el negocio.",
          },
          {
            title: "Implementar controles de calidad",
            description:
              "Establece verificaciones simples de calidad para garantizar la precisión y consistencia de los datos que recopilas.",
          },
          {
            title: "Normalizar formatos clave",
            description:
              "Estandariza los formatos de tus datos más importantes (fechas, categorías, etc.) para facilitar su análisis posterior.",
          },
        ];
      } else {
        return [
          {
            title: "Crear dashboards básicos",
            description:
              "Desarrolla visualizaciones simples pero efectivas de tus KPIs más importantes para facilitar su seguimiento regular.",
          },
          {
            title: "Implementar revisiones periódicas",
            description:
              "Establece un ritmo de revisión semanal o mensual de tus métricas clave con los responsables de cada área.",
          },
          {
            title: "Formar en interpretación básica",
            description:
              "Capacita a tu equipo en los fundamentos de interpretación de datos para que puedan extraer conclusiones útiles de la información.",
          },
        ];
      }
    } else if (level === "Intermedio") {
      // Recomendaciones para nivel intermedio...
      return [
        {
          title: "Integrar fuentes dispersas",
          description:
            "Implementa integraciones entre tus diferentes sistemas para eliminar la necesidad de procesos manuales y obtener una visión unificada.",
        },
        {
          title: "Desarrollar métricas avanzadas",
          description:
            "Ve más allá de las métricas básicas y desarrolla KPIs compuestos que capturen mejor la salud real y el rendimiento de tu negocio.",
        },
        {
          title: "Automatizar informes clave",
          description:
            "Configura la generación automática de informes para los insights más utilizados, liberando tiempo para análisis de mayor valor.",
        },
      ];
    } else {
      // Recomendaciones para nivel avanzado...
      return [
        {
          title: "Implementar análisis predictivo",
          description:
            "Evoluciona de análisis descriptivos a modelos predictivos que te permitan anticipar tendencias y comportamientos futuros.",
        },
        {
          title: "Desarrollar estrategia de datos",
          description:
            "Crea una estrategia formal de datos alineada con tus objetivos de negocio para maximizar el valor extraído de tu información.",
        },
        {
          title: "Fomentar cultura data-driven",
          description:
            "Impulsa una cultura organizacional donde las decisiones en todos los niveles estén respaldadas por datos relevantes y análisis riguroso.",
        },
      ];
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block w-12 h-12 border-4 border-umi-light-blue border-t-umi-blue-dark rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">
            {stage === "questions"
              ? "Analizando tus respuestas..."
              : "Preparando tu informe personalizado..."}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {stage === "welcome" && (
            <Welcome onStart={() => setStage("questions")} />
          )}

          {stage === "questions" && (
            <QuestionStep
              question={questions[currentQuestion - 1]}
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
            <ContactForm onSubmit={handleContactSubmit} />
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
      )}
    </div>
  );
};

export default DiagnosticQuiz;

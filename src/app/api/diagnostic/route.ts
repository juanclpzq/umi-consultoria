// src/app/api/diagnostic/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DiagnosticIntegration } from "@/lib/integration/diagnosticTrigger";

interface DiagnosticRequest {
  email: string;
  name: string;
  company?: string;
  responses: Record<string, any>;
}

interface DiagnosticResponse {
  score: number;
  level: string;
  recommendations: string[];
  areas: {
    dataCollection: number;
    analysis: number;
    visualization: number;
    decisionMaking: number;
  };
}

export async function POST(request: NextRequest) {
  let diagnosticIntegration: DiagnosticIntegration | null = null;

  try {
    const body: DiagnosticRequest = await request.json();

    // Validar datos requeridos
    if (!body.email || !body.name || !body.responses) {
      return NextResponse.json(
        { error: "Email, nombre y respuestas son requeridos" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Procesar diagnóstico (lógica existente)
    const diagnosticResult = calculateDiagnostic(body.responses);

    // Inicializar integración con base de datos
    diagnosticIntegration = new DiagnosticIntegration();

    // Procesar lead y manejar secuencia de emails
    const leadProcessing = await diagnosticIntegration.processDiagnostic({
      email: body.email,
      name: body.name,
      company: body.company,
      diagnosticResult,
      submissionDate: new Date().toISOString(),
    });

    console.log(`✅ Diagnóstico procesado para ${body.email}:`, {
      isNewLead: leadProcessing.isNewLead,
      emailsSent: leadProcessing.emailsToSend.length,
      message: leadProcessing.message,
    });

    // Responder con resultado del diagnóstico y estado del procesamiento
    return NextResponse.json({
      // Resultado del diagnóstico (visible para el usuario)
      diagnostic: diagnosticResult,

      // Información del procesamiento (para debugging)
      processing: {
        leadId: leadProcessing.leadId,
        isNewLead: leadProcessing.isNewLead,
        emailsSent: leadProcessing.emailsToSend.length,
        message: leadProcessing.message,
      },
    });
  } catch (error) {
    console.error("❌ Error en API de diagnóstico:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    // Cerrar conexión a base de datos
    if (diagnosticIntegration) {
      diagnosticIntegration.close();
    }
  }
}

// GET endpoint para métricas (opcional)
export async function GET(request: NextRequest) {
  let diagnosticIntegration: DiagnosticIntegration | null = null;

  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    diagnosticIntegration = new DiagnosticIntegration();

    switch (action) {
      case "metrics":
        const metrics = diagnosticIntegration.getMetrics();
        return NextResponse.json({ metrics });

      case "process-scheduled":
        const result = await diagnosticIntegration.processScheduledEmails();
        return NextResponse.json({ result });

      default:
        return NextResponse.json(
          { error: "Acción no válida. Use: metrics, process-scheduled" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("❌ Error en GET de diagnóstico:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    if (diagnosticIntegration) {
      diagnosticIntegration.close();
    }
  }
}

/**
 * Calcular resultado del diagnóstico basado en respuestas
 */
function calculateDiagnostic(
  responses: Record<string, any>
): DiagnosticResponse {
  // Lógica de cálculo del diagnóstico (mantener la existente o implementar nueva)

  // Ejemplo de cálculo basado en preguntas típicas
  const scores = {
    dataCollection: calculateAreaScore(responses, [
      "data_sources",
      "data_quality",
      "data_integration",
    ]),
    analysis: calculateAreaScore(responses, [
      "analysis_tools",
      "analysis_frequency",
      "analysis_depth",
    ]),
    visualization: calculateAreaScore(responses, [
      "visualization_tools",
      "dashboard_usage",
      "report_creation",
    ]),
    decisionMaking: calculateAreaScore(responses, [
      "decision_speed",
      "data_driven_decisions",
      "kpi_tracking",
    ]),
  };

  // Calcular score general
  const totalScore = Math.round(
    (scores.dataCollection +
      scores.analysis +
      scores.visualization +
      scores.decisionMaking) /
      4
  );

  // Determinar nivel
  let level: string;
  let recommendations: string[];

  if (totalScore >= 80) {
    level = "Avanzado";
    recommendations = [
      "Implementar análisis predictivo y machine learning",
      "Automatizar reportes y alertas inteligentes",
      "Establecer gobierno de datos robusto",
      "Explorar análisis en tiempo real",
    ];
  } else if (totalScore >= 60) {
    level = "Intermedio";
    recommendations = [
      "Centralizar fuentes de datos en un data warehouse",
      "Implementar dashboards interactivos",
      "Establecer KPIs claros y medibles",
      "Capacitar al equipo en herramientas de BI",
    ];
  } else if (totalScore >= 40) {
    level = "Básico";
    recommendations = [
      "Implementar herramientas básicas de visualización",
      "Establecer procesos de recolección de datos",
      "Crear reportes automatizados simples",
      "Definir métricas clave del negocio",
    ];
  } else {
    level = "Inicial";
    recommendations = [
      "Identificar y documentar fuentes de datos críticas",
      "Implementar recolección sistemática de datos",
      "Crear primeros reportes básicos",
      "Establecer cultura de toma de decisiones basada en datos",
    ];
  }

  return {
    score: totalScore,
    level,
    recommendations,
    areas: scores,
  };
}

/**
 * Calcular score de un área específica
 */
function calculateAreaScore(
  responses: Record<string, any>,
  questions: string[]
): number {
  let totalScore = 0;
  let validQuestions = 0;

  for (const question of questions) {
    if (responses[question] !== undefined) {
      // Normalizar respuesta a escala 0-100
      let questionScore = 0;
      const response = responses[question];

      if (typeof response === "number") {
        // Si es número directo (escala 1-5, convertir a 0-100)
        questionScore = ((response - 1) / 4) * 100;
      } else if (typeof response === "string") {
        // Si es texto, mapear según opciones comunes
        const scoreMap: Record<string, number> = {
          nunca: 0,
          rara_vez: 25,
          a_veces: 50,
          frecuentemente: 75,
          siempre: 100,
          ninguna: 0,
          básica: 25,
          intermedia: 50,
          avanzada: 75,
          experta: 100,
          manual: 25,
          semi_automatico: 50,
          automatico: 75,
          tiempo_real: 100,
        };
        questionScore = scoreMap[response.toLowerCase()] || 50;
      } else if (typeof response === "boolean") {
        questionScore = response ? 100 : 0;
      }

      totalScore += questionScore;
      validQuestions++;
    }
  }

  return validQuestions > 0 ? Math.round(totalScore / validQuestions) : 0;
}

import { NextRequest, NextResponse } from "next/server";
import * as nodemailer from "nodemailer";

// Tipos para el diagnóstico
interface DiagnosticResult {
  answers: Record<number, string>;
  score: number;
  levelName: string;
  contactInfo: {
    name: string;
    email: string;
    company: string;
    phone?: string;
  };
  completionTime?: number; // tiempo en segundos
  timestamp: string;
}

// Configuración del transportador (reutilizamos la misma configuración)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Mapeo de respuestas para análisis
const getAnswerAnalysis = (questionId: number, answer: string) => {
  const analysisMap: Record<number, Record<string, any>> = {
    1: {
      // Etapa de analítica
      inicial: {
        label: "Nivel Inicial",
        description: "Datos dispersos o poco organizados",
        priority: "alta",
        recommendations: [
          "Centralización de datos",
          "Auditoría de fuentes",
          "Procesos básicos de captura",
        ],
      },
      intermedio: {
        label: "Nivel Intermedio",
        description: "Datos organizados pero no optimizados",
        priority: "media",
        recommendations: [
          "Integración de sistemas",
          "Métricas avanzadas",
          "Automatización de informes",
        ],
      },
      avanzado: {
        label: "Nivel Avanzado",
        description: "Datos organizados buscando mejorar",
        priority: "baja",
        recommendations: [
          "Análisis predictivo",
          "Estrategia de datos",
          "Cultura data-driven",
        ],
      },
    },
    2: {
      // Toma de decisiones
      intuicion: {
        label: "Por Intuición",
        description: "Basadas en experiencia o corazonadas",
        priority: "alta",
        gap: "Falta de framework analítico estructurado",
      },
      datos_basicos: {
        label: "Datos Básicos",
        description: "Consulta de informes simples",
        priority: "media",
        gap: "Necesita análisis más profundo y contextual",
      },
      analisis: {
        label: "Análisis Estructurado",
        description: "Proceso formal de análisis de datos",
        priority: "baja",
        gap: "Optimización y escalabilidad del proceso",
      },
    },
    3: {
      // Principal desafío
      recopilacion: {
        label: "Recopilación de Datos",
        description: "Obtener y centralizar información",
        priority: "alta",
        solution:
          "Implementar sistema de centralización y auditoría de fuentes",
      },
      organizacion: {
        label: "Organización de Datos",
        description: "Estructurar datos para análisis",
        priority: "media",
        solution: "Desarrollar esquemas de organización y controles de calidad",
      },
      interpretacion: {
        label: "Interpretación de Datos",
        description: "Extraer insights accionables",
        priority: "media",
        solution: "Crear dashboards y capacitar en interpretación",
      },
    },
  };

  return (
    analysisMap[questionId]?.[answer] || { label: answer, priority: "media" }
  );
};

// Calcular métricas de negocio estimadas
const calculateBusinessMetrics = (
  answers: Record<number, string>,
  levelName: string
) => {
  const baseMetrics = {
    timeToValue: 30, // días
    expectedROI: 150, // porcentaje
    implementationComplexity: 3, // 1-5
    urgencyScore: 5, // 1-10
  };

  // Ajustar métricas basado en nivel
  if (levelName === "Inicial") {
    baseMetrics.timeToValue = 45;
    baseMetrics.expectedROI = 200;
    baseMetrics.implementationComplexity = 2;
    baseMetrics.urgencyScore = 8;
  } else if (levelName === "Avanzado") {
    baseMetrics.timeToValue = 15;
    baseMetrics.expectedROI = 120;
    baseMetrics.implementationComplexity = 4;
    baseMetrics.urgencyScore = 6;
  }

  // Ajustar por tipo de desafío principal
  if (answers[3] === "recopilacion") {
    baseMetrics.urgencyScore += 2;
    baseMetrics.timeToValue += 15;
  }

  return baseMetrics;
};

// Template de email para analistas de Umi
const generateAnalystEmailTemplate = (data: DiagnosticResult): string => {
  const answers = data.answers;
  const metrics = calculateBusinessMetrics(answers, data.levelName);

  // Análisis detallado de cada respuesta
  const detailedAnalysis = Object.entries(answers).map(
    ([questionId, answer]) => {
      const analysis = getAnswerAnalysis(parseInt(questionId), answer);
      return { questionId: parseInt(questionId), answer, analysis };
    }
  );

  const questions = [
    "¿En qué etapa de analítica de datos se encuentra tu empresa?",
    "¿Cómo toma actualmente decisiones importantes en su negocio?",
    "¿Cuál es tu principal desafío con los datos de tu negocio?",
  ];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Source Sans Pro', Arial, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #223979 0%, #7692CB 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
        .logo { font-family: 'Domus', Arial, sans-serif; font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .client-info { background: #f0f4ff; padding: 20px; border-radius: 8px; border-left: 4px solid #223979; margin-bottom: 30px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin: 25px 0; }
        .metric-card { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; }
        .metric-value { font-size: 24px; font-weight: bold; color: #223979; }
        .metric-label { font-size: 12px; color: #64748b; margin-top: 5px; }
        .analysis-section { margin: 30px 0; }
        .question-analysis { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .question-title { font-weight: 600; color: #1e293b; margin-bottom: 10px; font-size: 14px; }
        .answer-pill { display: inline-block; background: #7692CB; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 10px; }
        .priority-high { border-left: 4px solid #ef4444; }
        .priority-media { border-left: 4px solid #f59e0b; }
        .priority-baja { border-left: 4px solid #10b981; }
        .recommendations { background: #fefce8; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .action-items { background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; }
        .tag { display: inline-block; background: #e2e8f0; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 11px; margin: 2px; }
        .urgency-high { background: #fee2e2; color: #dc2626; }
        .urgency-medium { background: #fef3c7; color: #d97706; }
        .urgency-low { background: #d1fae5; color: #059669; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">umi</div>
          <h2>📊 Diagnóstico Completo de Cliente</h2>
          <p>Análisis detallado para estrategia de consultoría</p>
        </div>
        
        <div class="content">
          <!-- Información del Cliente -->
          <div class="client-info">
            <h3 style="margin-top: 0; color: #223979;">👤 Información del Cliente</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div>
                <strong>Nombre:</strong> ${data.contactInfo.name}<br>
                <strong>Email:</strong> ${data.contactInfo.email}<br>
                <strong>Empresa:</strong> ${data.contactInfo.company || "No especificada"}
                ${data.contactInfo.phone ? `<br><strong>Teléfono:</strong> ${data.contactInfo.phone}` : ""}
              </div>
              <div>
                <strong>Nivel de Madurez:</strong> <span class="tag">${data.levelName}</span><br>
                <strong>Puntuación:</strong> ${data.score}/10<br>
                <strong>Completado:</strong> ${new Date(data.timestamp).toLocaleString("es-ES")}
                ${data.completionTime ? `<br><strong>Tiempo:</strong> ${Math.round(data.completionTime / 60)} minutos` : ""}
              </div>
            </div>
          </div>

          <!-- Métricas de Negocio -->
          <h3>📈 Métricas de Oportunidad</h3>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${metrics.timeToValue}</div>
              <div class="metric-label">Días hasta valor</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metrics.expectedROI}%</div>
              <div class="metric-label">ROI Estimado</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metrics.implementationComplexity}/5</div>
              <div class="metric-label">Complejidad</div>
            </div>
            <div class="metric-card">
              <div class="metric-value ${metrics.urgencyScore >= 8 ? "urgency-high" : metrics.urgencyScore >= 6 ? "urgency-medium" : "urgency-low"}">${metrics.urgencyScore}/10</div>
              <div class="metric-label">Urgencia</div>
            </div>
          </div>

          <!-- Análisis Detallado por Pregunta -->
          <div class="analysis-section">
            <h3>🔍 Análisis Detallado de Respuestas</h3>
            
            ${detailedAnalysis
              .map(
                (item, index) => `
              <div class="question-analysis priority-${item.analysis.priority}">
                <div class="question-title">
                  ${index + 1}. ${questions[item.questionId - 1]}
                </div>
                <div class="answer-pill">${item.analysis.label || item.answer}</div>
                <p><strong>Interpretación:</strong> ${item.analysis.description || "Respuesta registrada"}</p>
                
                ${item.analysis.gap ? `<p><strong>Gap identificado:</strong> ${item.analysis.gap}</p>` : ""}
                ${item.analysis.solution ? `<p><strong>Solución recomendada:</strong> ${item.analysis.solution}</p>` : ""}
                
                ${
                  item.analysis.recommendations
                    ? `
                  <div class="recommendations">
                    <strong>🎯 Recomendaciones específicas:</strong>
                    <ul style="margin: 10px 0;">
                      ${item.analysis.recommendations.map((rec: string) => `<li>${rec}</li>`).join("")}
                    </ul>
                  </div>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>

          <!-- Plan de Acción Recomendado -->
          <div class="action-items">
            <h3 style="margin-top: 0; color: #059669;">🚀 Plan de Acción Prioritario</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
              <div>
                <h4>⚡ Acciones Inmediatas (0-2 semanas)</h4>
                <ul>
                  ${
                    data.levelName === "Inicial"
                      ? `
                    <li>Auditoría inicial de fuentes de datos</li>
                    <li>Mapeo de procesos críticos</li>
                    <li>Propuesta de centralización</li>
                  `
                      : data.levelName === "Intermedio"
                        ? `
                    <li>Análisis de gaps en integración</li>
                    <li>Identificación de métricas clave</li>
                    <li>Plan de automatización</li>
                  `
                        : `
                    <li>Evaluación de arquitectura actual</li>
                    <li>Identificación de casos de uso avanzados</li>
                    <li>Estrategia de optimización</li>
                  `
                  }
                </ul>
              </div>
              <div>
                <h4>🎯 Objetivos a Medio Plazo (1-3 meses)</h4>
                <ul>
                  ${
                    answers[3] === "recopilacion"
                      ? `
                    <li>Implementar sistema de centralización</li>
                    <li>Establecer procesos de calidad</li>
                    <li>Capacitar equipo en nuevos procesos</li>
                  `
                      : answers[3] === "organizacion"
                        ? `
                    <li>Desarrollar estructura de datos</li>
                    <li>Implementar controles de calidad</li>
                    <li>Crear primeros dashboards</li>
                  `
                        : `
                    <li>Desarrollar visualizaciones avanzadas</li>
                    <li>Capacitar en interpretación</li>
                    <li>Implementar ciclos de revisión</li>
                  `
                  }
                </ul>
              </div>
            </div>
          </div>

          <!-- Información para el Seguimiento -->
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">📋 Información para Seguimiento</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div>
                <strong>Propuesta sugerida:</strong><br>
                ${data.levelName === "Inicial" ? "Paquete Foundation" : data.levelName === "Intermedio" ? "Paquete Growth" : "Paquete Advanced"}<br>
                <strong>Duración estimada:</strong> ${metrics.timeToValue} días<br>
                <strong>Inversión aproximada:</strong> A cotizar según alcance
              </div>
              <div>
                <strong>Contacto recomendado:</strong><br>
                ${metrics.urgencyScore >= 8 ? "Llamada inmediata (< 2 horas)" : metrics.urgencyScore >= 6 ? "Email + llamada (< 4 horas)" : "Email profesional (< 24 horas)"}<br>
                <strong>Especialista asignado:</strong> Por definir<br>
                <strong>Next steps:</strong> Agendar demo personalizada
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Umi Consultoría</strong> - Análisis interno</p>
          <p>Generado automáticamente: ${new Date().toLocaleString("es-ES", {
            timeZone: "America/Mexico_City",
          })}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template de respuesta para el cliente (más rico que el formulario básico)
const generateClientDiagnosticReply = (data: DiagnosticResult): string => {
  const metrics = calculateBusinessMetrics(data.answers, data.levelName);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Source Sans Pro', Arial, sans-serif; line-height: 1.6; color: #000000; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #223979 0%, #7692CB 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
        .logo { font-family: 'Domus', Arial, sans-serif; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .score-circle { 
          width: 120px; 
          height: 120px; 
          border-radius: 50%; 
          background: linear-gradient(135deg, #223979 0%, #7692CB 100%); 
          color: white; 
          margin: 20px auto; 
          font-size: 32px; 
          font-weight: bold; 
          text-align: center; 
          line-height: 120px;
          vertical-align: middle;
          display: table-cell;
        }
        .highlight-box { background: #f0f4ff; padding: 20px; border-radius: 8px; border-left: 4px solid #7692CB; margin: 20px 0; }
        .metrics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 25px 0; }
        .metric-card { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 20px; font-weight: bold; color: #223979; }
        .cta-button { background: #223979; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 15px 0; font-weight: 600; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 12px 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">umi</div>
          <h2>🎉 Tu Diagnóstico Está Completo</h2>
          <p>Análisis personalizado de tu madurez analítica</p>
        </div>
        
        <div class="content">
          <p>Hola <strong>${data.contactInfo.name}</strong>,</p>
          
          <p>¡Excelente! Has completado nuestro diagnóstico de madurez analítica. Aquí tienes un resumen de tus resultados:</p>

          <div style="text-align: center;">
            <table cellpadding="0" cellspacing="0" border="0" style="margin: 20px auto;">
              <tr>
                <td style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #223979 0%, #7692CB 100%); color: white; font-size: 32px; font-weight: bold; text-align: center; vertical-align: middle;">${data.score}/10</td>
              </tr>
            </table>
            <h3 style="color: #223979; margin: 10px 0;">Nivel: ${data.levelName}</h3>
          </div>

          <div class="highlight-box">
            <h4 style="margin-top: 0;">🎯 Tu Oportunidad Principal</h4>
            <p>${
              data.answers[3] === "recopilacion"
                ? "Implementar un sistema centralizado de recopilación que elimine silos de información y permita una visión unificada del negocio."
                : data.answers[3] === "organizacion"
                  ? "Estructurar tus datos existentes para facilitar análisis más profundos y descubrir patrones que impulsen decisiones estratégicas."
                  : "Desarrollar visualizaciones claras y frameworks de interpretación que conviertan tus datos en insights accionables."
            }</p>
          </div>

          <h4>📊 Impacto Potencial Estimado</h4>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${metrics.timeToValue} días</div>
              <div style="font-size: 12px; color: #64748b;">Tiempo hasta resultados</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metrics.expectedROI}%</div>
              <div style="font-size: 12px; color: #64748b;">ROI estimado</div>
            </div>
          </div>

          <div class="highlight-box">
            <h4 style="margin-top: 0;">🚀 Próximos Pasos Recomendados</h4>
            <ol style="margin: 10px 0;">
              <li><strong>Consulta estratégica gratuita</strong> - Revisamos tu situación específica</li>
              <li><strong>Plan personalizado</strong> - Desarrollamos una hoja de ruta adaptada a tu negocio</li>
              <li><strong>Implementación</strong> - Te acompañamos en cada paso del proceso</li>
            </ol>
          </div>

          <div style="text-align: center;">
            <a href="https://calendly.com/umi-consultoria/consulta-estrategica" style="background: #223979; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 15px 0; font-weight: 600;">
              📅 Agendar Consulta Gratuita
            </a>
          </div>

          <p><strong>🎁 Bonus especial:</strong> Por completar el diagnóstico, tienes acceso gratuito a:</p>
          <ul>
            <li>✅ Plantilla de auditoría de datos</li>
            <li>✅ Guía de primeros pasos en BI</li>
            <li>✅ Dashboard template básico</li>
          </ul>

          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #10b981; margin: 20px 0;">
            <div style="display: flex; align-items: center; color: #065f46;">
              <svg width="20" height="20" style="margin-right: 8px;" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <strong>Garantía de satisfacción:</strong> Si no encuentras valor en nuestra consulta inicial, la siguiente sesión es completamente gratuita.
            </div>
          </div>

          <p>Nuestro equipo ya está revisando tu diagnóstico y te contactaremos en las próximas 2 horas para agendar tu consulta estratégica.</p>
          
          <p>¡Esperamos ayudarte a transformar tus datos en tu ventaja competitiva!</p>
          
          <p>Saludos cordiales,<br>
          <strong>Equipo Umi Consultoría</strong></p>
        </div>

        <div class="footer">
          <p><strong>Umi Consultoría</strong></p>
          <p>📧 hola@umiconsulting.co | 📱 +52 667 730 1913</p>
          <p>Análisis de datos e inteligencia de negocio</p>
          <p><a href="#" style="color: #6b7280;">Descargar recursos gratuitos</a> | <a href="#" style="color: #6b7280;">Ver casos de éxito</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const data: DiagnosticResult = await request.json();

    // Validación básica
    if (!data.contactInfo?.name || !data.contactInfo?.email || !data.answers) {
      return NextResponse.json(
        { error: "Información de contacto y respuestas son requeridas" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactInfo.email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    const transporter = createTransporter();

    // Email para analistas de Umi (diagnóstico completo)
    const analystMailOptions = {
      from: `"Umi Consultoría" <${process.env.EMAIL_USER}>`,
      to: "hola@umiconsulting.co",
      subject: `🔬 Diagnóstico Completo: ${data.contactInfo.name} (${data.levelName}) - ${data.contactInfo.company || "Cliente potencial"}`,
      html: generateAnalystEmailTemplate(data),
      text: `
        Nuevo diagnóstico completado:
        
        Cliente: ${data.contactInfo.name}
        Email: ${data.contactInfo.email}
        Empresa: ${data.contactInfo.company || "No especificada"}
        Nivel: ${data.levelName}
        Puntuación: ${data.score}/10
        
        Respuestas:
        ${Object.entries(data.answers)
          .map(([q, a]) => `Pregunta ${q}: ${a}`)
          .join("\n")}
        
        Fecha: ${new Date(data.timestamp).toLocaleString("es-ES")}
      `,
    };

    // Email de respuesta al cliente (diagnóstico completado)
    const clientMailOptions = {
      from: `"Umi Consultoría" <${process.env.EMAIL_USER}>`,
      to: data.contactInfo.email,
      subject: `🎯 Tu Diagnóstico Personalizado (Nivel ${data.levelName}) - Umi Consultoría`,
      html: generateClientDiagnosticReply(data),
      text: `
        Hola ${data.contactInfo.name},
        
        ¡Tu diagnóstico está completo!
        
        Nivel de madurez: ${data.levelName}
        Puntuación: ${data.score}/10
        
        Te contactaremos pronto para agendar tu consulta estratégica gratuita.
        
        Mientras tanto, descarga tus recursos gratuitos en:
        https://umiconsultoria.com/recursos
        
        Saludos,
        Equipo Umi Consultoría
      `,
    };

    // Enviar ambos emails
    await Promise.all([
      transporter.sendMail(analystMailOptions),
      transporter.sendMail(clientMailOptions),
    ]);

    // Log para debugging
    console.log("Diagnóstico procesado exitosamente:", {
      cliente: data.contactInfo.email,
      empresa: data.contactInfo.company,
      nivel: data.levelName,
      score: data.score,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Diagnóstico procesado exitosamente",
    });
  } catch (error) {
    console.error("Error al procesar diagnóstico:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

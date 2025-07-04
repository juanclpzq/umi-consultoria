// 🔗 INTEGRACIÓN AUTOMÁTICA CON DIAGNÓSTICO
// src/lib/integration/diagnosticTrigger.ts

import { getSequenceManager, Lead } from "@/lib/email/sequenceManager";
import { EmailTemplateData } from "@/lib/email/templates";

export interface DiagnosticData {
  contactInfo: {
    name: string;
    email: string;
    company: string;
    phone?: string;
  };
  answers: Record<number, string>;
  score: number;
  levelName: string;
  timestamp: string;
  completionTime?: number;
}

export class DiagnosticIntegration {
  private sequenceManager = getSequenceManager();

  // 🚀 MÉTODO PRINCIPAL: Procesar diagnóstico completado
  async processDiagnosticCompletion(diagnosticData: DiagnosticData): Promise<{
    leadCreated: boolean;
    sequenceStarted: boolean;
    leadId: string;
    emailSent: boolean;
  }> {
    try {
      console.log(
        `🎯 Procesando diagnóstico completado: ${diagnosticData.contactInfo.email}`
      );

      // 1. Crear lead desde diagnóstico
      const lead = this.createLeadFromDiagnostic(diagnosticData);

      // 2. Registrar lead en el sistema (en producción: guardar en DB)
      const leadId = await this.registerLead(lead);

      // 3. Iniciar secuencia inmediatamente (Day 0)
      const emailSent = await this.startImmediateSequence(lead);

      // 4. Programar seguimientos futuros
      await this.scheduleFollowUps(lead);

      console.log(`✅ Diagnóstico procesado exitosamente: ${leadId}`);

      return {
        leadCreated: true,
        sequenceStarted: true,
        leadId,
        emailSent,
      };
    } catch (error) {
      console.error("❌ Error procesando diagnóstico:", error);
      throw error;
    }
  }

  // 🏗️ CREAR LEAD DESDE DIAGNÓSTICO
  private createLeadFromDiagnostic(data: DiagnosticData): Lead {
    const quickWins = this.generateQuickWins(data.answers, data.levelName);
    const estimatedROI = this.calculateEstimatedROI(data.score, data.levelName);
    const primaryChallenge = this.identifyPrimaryChallenge(data.answers);

    return {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: data.contactInfo.email,
      name: data.contactInfo.name,
      company: data.contactInfo.company || "Empresa",
      diagnosticDate: new Date(data.timestamp),
      meetingScheduled: false,
      meetingAttended: false,
      emailsSent: [],
      sequencePaused: false,
      diagnosticData: {
        score: data.score,
        level: data.levelName,
        primaryChallenge,
        quickWins,
        estimatedROI,
      },
    };
  }

  // 📊 GENERAR QUICK WINS BASADO EN RESPUESTAS
  private generateQuickWins(
    answers: Record<number, string>,
    level: string
  ): Array<{ action: string; description: string }> {
    const quickWins = [];

    // Analizar respuestas específicas
    const dataStage = answers[1]; // Etapa de analítica
    const decisionProcess = answers[2]; // Toma de decisiones
    const mainChallenge = answers[3]; // Principal desafío

    // Quick wins por etapa
    if (dataStage === "inicial") {
      quickWins.push({
        action: "Centralización de datos",
        description: "Unificar todas las fuentes de datos en un solo lugar",
      });
      quickWins.push({
        action: "Dashboard básico",
        description: "Implementar 5 KPIs fundamentales para tu negocio",
      });
    } else if (dataStage === "intermedio") {
      quickWins.push({
        action: "Automatización de reportes",
        description: "Eliminar trabajo manual en reportes semanales",
      });
      quickWins.push({
        action: "Análisis de tendencias",
        description: "Identificar patrones para decisiones proactivas",
      });
    } else if (dataStage === "avanzado") {
      quickWins.push({
        action: "Análisis predictivo",
        description: "Implementar modelos para anticipar resultados",
      });
      quickWins.push({
        action: "Cultura data-driven",
        description: "Capacitar equipo en toma de decisiones basada en datos",
      });
    }

    // Quick win adicional por desafío principal
    if (mainChallenge === "recopilacion") {
      quickWins.push({
        action: "Auditoría de fuentes",
        description: "Mapear y optimizar todas las fuentes de datos",
      });
    } else if (mainChallenge === "organizacion") {
      quickWins.push({
        action: "Estructura de datos",
        description: "Crear esquema organizado y escalable",
      });
    } else if (mainChallenge === "interpretacion") {
      quickWins.push({
        action: "Dashboard ejecutivo",
        description: "Visualizaciones claras para decisiones rápidas",
      });
    }

    return quickWins.slice(0, 3); // Máximo 3 quick wins
  }

  // 💰 CALCULAR ROI ESTIMADO
  private calculateEstimatedROI(
    score: number,
    level: string
  ): { timeToValue: number; expectedReturn: number } {
    let timeToValue = 90; // días por defecto
    let expectedReturn = 150; // % por defecto

    // Ajustar por nivel
    switch (level.toLowerCase()) {
      case "inicial":
        timeToValue = 30;
        expectedReturn = 200;
        break;
      case "intermedio":
        timeToValue = 45;
        expectedReturn = 300;
        break;
      case "avanzado":
        timeToValue = 60;
        expectedReturn = 400;
        break;
    }

    // Ajustar por score
    if (score <= 3) {
      expectedReturn += 50; // Más margen de mejora
    } else if (score >= 7) {
      expectedReturn -= 50; // Menos margen, pero más eficiente
      timeToValue -= 15;
    }

    return { timeToValue, expectedReturn };
  }

  // 🎯 IDENTIFICAR DESAFÍO PRINCIPAL
  private identifyPrimaryChallenge(answers: Record<number, string>): string {
    const challengeMap: Record<string, string> = {
      recopilacion: "Recopilación de datos",
      organizacion: "Organización de datos",
      interpretacion: "Interpretación de datos",
      inicial: "Estructuración inicial de analítica",
      intermedio: "Optimización de procesos existentes",
      avanzado: "Escalamiento y automatización",
    };

    // Priorizar desafío específico (pregunta 3)
    const specificChallenge = answers[3];
    if (challengeMap[specificChallenge]) {
      return challengeMap[specificChallenge];
    }

    // Fallback por nivel general (pregunta 1)
    const generalLevel = answers[1];
    return challengeMap[generalLevel] || "Optimización de analítica de datos";
  }

  // 💾 REGISTRAR LEAD (en producción: guardar en DB)
  private async registerLead(lead: Lead): Promise<string> {
    // En producción, guardar en base de datos
    console.log(
      `💾 Registrando lead: ${lead.email} (${lead.diagnosticData.level})`
    );

    /*
    // Ejemplo con Prisma/MongoDB:
    const savedLead = await db.leads.create({
      data: {
        id: lead.id,
        email: lead.email,
        name: lead.name,
        company: lead.company,
        diagnosticDate: lead.diagnosticDate,
        diagnosticData: lead.diagnosticData,
        emailsSent: [],
        sequencePaused: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    */

    // Por ahora, simular guardado exitoso
    return lead.id;
  }

  // ⚡ INICIAR SECUENCIA INMEDIATA (Day 0)
  private async startImmediateSequence(lead: Lead): Promise<boolean> {
    try {
      console.log(`⚡ Iniciando secuencia inmediata para: ${lead.email}`);

      // Procesar solo este lead específico
      const results = await this.sequenceManager.processLeadSequences(lead);

      if (results.sent > 0) {
        console.log(`✅ Email Day 0 enviado a: ${lead.email}`);
        return true;
      } else {
        console.log(`❌ Falló envío Day 0 para: ${lead.email}`);
        return false;
      }
    } catch (error) {
      console.error(
        `❌ Error en secuencia inmediata para ${lead.email}:`,
        error
      );
      return false;
    }
  }

  // 📅 PROGRAMAR SEGUIMIENTOS
  private async scheduleFollowUps(lead: Lead): Promise<void> {
    console.log(`📅 Programando seguimientos para: ${lead.email}`);

    // Los seguimientos se ejecutarán automáticamente con los cron jobs
    // Day 2, 5, 10, 30 se procesarán cuando corresponda

    // En producción, puedes crear registros específicos:
    /*
    const followUps = [
      { day: 2, scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
      { day: 5, scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
      { day: 10, scheduledFor: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) },
      { day: 30, scheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    ];
    
    for (const followUp of followUps) {
      await db.scheduledEmails.create({
        data: {
          leadId: lead.id,
          day: followUp.day,
          scheduledFor: followUp.scheduledFor,
          status: 'pending'
        }
      });
    }
    */
  }

  // 🔍 MÉTODOS DE CONSULTA
  async getLeadStatus(leadId: string): Promise<any> {
    // En producción: consultar DB
    console.log(`🔍 Consultando status de lead: ${leadId}`);
    return {
      leadId,
      status: "active",
      emailsSent: [],
      lastEmail: null,
      nextEmail: null,
    };
  }

  async pauseLeadSequence(
    leadId: string,
    reason: string = "manual"
  ): Promise<boolean> {
    return await this.sequenceManager.pauseSequenceForLead(leadId, reason);
  }

  async markLeadAsResponded(
    leadId: string,
    responseType: string = "email"
  ): Promise<boolean> {
    return await this.sequenceManager.markLeadAsResponded(leadId, responseType);
  }
}

// 🔧 ACTUALIZACIÓN DEL API DE DIAGNÓSTICO
// Modificar src/app/api/diagnostic/route.ts

export async function POST(request: NextRequest) {
  try {
    const data: DiagnosticData = await request.json();

    // ... validaciones existentes ...

    // **NUEVA FUNCIONALIDAD: Integración automática**
    const diagnosticIntegration = new DiagnosticIntegration();

    // Procesar diagnóstico e iniciar secuencia
    const integrationResult =
      await diagnosticIntegration.processDiagnosticCompletion(data);

    // ... emails existentes (para analistas y cliente) ...

    return NextResponse.json({
      success: true,
      message: "Diagnóstico procesado exitosamente",
      integration: {
        leadCreated: integrationResult.leadCreated,
        sequenceStarted: integrationResult.sequenceStarted,
        emailSent: integrationResult.emailSent,
        leadId: integrationResult.leadId,
      },
    });
  } catch (error) {
    console.error("Error al procesar diagnóstico:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// 📡 API PARA GESTIÓN MANUAL DE LEADS
// src/app/api/leads/route.ts

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId");

    const integration = new DiagnosticIntegration();

    if (leadId) {
      const leadStatus = await integration.getLeadStatus(leadId);
      return NextResponse.json({ success: true, lead: leadStatus });
    } else {
      // Retornar todos los leads (implementar paginación en producción)
      return NextResponse.json({
        success: true,
        leads: [], // Consultar desde DB
        total: 0,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo leads" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { leadId, action, data } = await request.json();
    const integration = new DiagnosticIntegration();

    switch (action) {
      case "pause":
        const pauseResult = await integration.pauseLeadSequence(
          leadId,
          data?.reason
        );
        return NextResponse.json({ success: pauseResult, action: "paused" });

      case "mark_responded":
        const respondResult = await integration.markLeadAsResponded(
          leadId,
          data?.type
        );
        return NextResponse.json({
          success: respondResult,
          action: "marked_responded",
        });

      default:
        return NextResponse.json(
          { error: "Acción no válida" },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error actualizando lead" },
      { status: 500 }
    );
  }
}

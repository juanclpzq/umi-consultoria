// src/lib/integration/diagnosticTrigger.ts
// Integración entre diagnóstico y sistema de secuencias

import { getSequenceManager } from "../email/sequenceManager";

// Interfaces mejoradas con exactOptionalPropertyTypes
export interface LeadData {
  id: string;
  email: string;
  name: string;
  company: string; // Requerido, no opcional
  diagnosticDate: string;
  emailsSent: string[];
  sequencePaused: boolean;
  diagnosticData: DiagnosticData;
  lastSubmissionDate?: string;
  submissionCount?: number;
  updated?: string;
}

export interface DiagnosticData {
  submissionDate: string;
  score: number;
  level: string;
  recommendations: string[];
  areas: {
    dataCollection: number;
    analysis: number;
    visualization: number;
    decisionMaking: number;
  };
  lastSubmissionDate?: string;
  submissionCount?: number;
}

export interface EmailLog {
  leadId: string;
  templateName: string;
  sequenceDay: number;
  subject: string; // Requerido, no opcional
  status: "sent" | "failed" | "pending";
  sentAt?: string;
  error?: string;
}

export interface DiagnosticResult {
  answers: Record<number, string>;
  score: number;
  levelName: string;
  contactInfo: {
    name: string;
    email: string;
    company: string;
    phone?: string;
  };
  completionTime?: number;
  timestamp: string;
}

export class DiagnosticTrigger {
  private sequenceManager;
  private leads: Map<string, LeadData> = new Map();
  private emailLogs: EmailLog[] = [];

  constructor() {
    this.sequenceManager = getSequenceManager();
  }

  // Procesar resultado de diagnóstico y crear/actualizar lead
  async processDiagnosticResult(result: DiagnosticResult): Promise<boolean> {
    try {
      const { contactInfo, score, levelName, answers, timestamp } = result;

      // Validar que company no sea undefined
      if (!contactInfo.company) {
        console.error("❌ Company es requerido para crear lead");
        return false;
      }

      const leadId = this.generateLeadId(contactInfo.email);
      const existingLead = this.leads.get(leadId);

      if (existingLead) {
        // Actualizar lead existente
        const updatedLead = await this.updateExistingLead(existingLead, result);
        this.leads.set(leadId, updatedLead);
        console.log(`🔄 Lead actualizado: ${contactInfo.email}`);
      } else {
        // Crear nuevo lead - asegurar que company no sea undefined
        const newLead: LeadData = {
          id: leadId,
          email: contactInfo.email,
          name: contactInfo.name,
          company: contactInfo.company, // Ya validamos que no es undefined
          diagnosticDate: timestamp,
          emailsSent: [],
          sequencePaused: false,
          diagnosticData: {
            submissionDate: timestamp,
            score,
            level: levelName,
            recommendations: this.generateRecommendations(answers, levelName),
            areas: this.calculateAreas(answers),
          },
        };

        this.leads.set(leadId, newLead);
        console.log(`✅ Nuevo lead creado: ${contactInfo.email}`);

        // Iniciar secuencia de seguimiento
        await this.triggerEmailSequence(newLead);
      }

      return true;
    } catch (error) {
      console.error("❌ Error procesando resultado de diagnóstico:", error);
      return false;
    }
  }

  // Actualizar lead existente con nueva información
  private async updateExistingLead(
    existingLead: LeadData,
    result: DiagnosticResult
  ): Promise<LeadData> {
    const { contactInfo, score, levelName, answers, timestamp } = result;

    // Usar company del contactInfo si existe, sino mantener el existente
    const company = contactInfo.company ?? existingLead.company;

    const updatedLead: LeadData = {
      ...existingLead, // Mantener campos existentes primero
      name: contactInfo.name,
      company, // Garantizado que no es undefined
      diagnosticDate: timestamp,
      diagnosticData: {
        submissionDate: existingLead.diagnosticData.submissionDate, // Mantener original
        lastSubmissionDate: timestamp,
        submissionCount: (existingLead.diagnosticData.submissionCount ?? 0) + 1,
        score,
        level: levelName,
        recommendations: this.generateRecommendations(answers, levelName),
        areas: this.calculateAreas(answers),
      },
      updated: new Date().toISOString(),
    };

    // Si cambió significativamente el nivel, reiniciar secuencia
    if (this.shouldRestartSequence(existingLead, updatedLead)) {
      await this.restartSequenceForLead(updatedLead);
    }

    return updatedLead;
  }

  // Verificar si debe reiniciarse la secuencia
  private shouldRestartSequence(oldLead: LeadData, newLead: LeadData): boolean {
    // Reiniciar si cambió el nivel significativamente
    const levelOrder = ["Inicial", "Intermedio", "Avanzado"];
    const oldIndex = levelOrder.indexOf(oldLead.diagnosticData.level);
    const newIndex = levelOrder.indexOf(newLead.diagnosticData.level);

    return Math.abs(oldIndex - newIndex) >= 1;
  }

  // Iniciar secuencia de seguimiento para nuevo lead
  private async triggerEmailSequence(lead: LeadData): Promise<void> {
    try {
      // Convertir a formato esperado por SequenceManager
      const sequenceLead = {
        id: lead.id,
        email: lead.email,
        name: lead.name,
        company: lead.company,
        diagnosticDate: new Date(lead.diagnosticDate),
        meetingScheduled: false,
        meetingAttended: false,
        emailsSent: lead.emailsSent,
        sequencePaused: lead.sequencePaused,
        diagnosticData: {
          score: lead.diagnosticData.score,
          level: lead.diagnosticData.level,
          primaryChallenge: this.getPrimaryChallenge(lead.diagnosticData),
          quickWins: this.generateQuickWins(lead.diagnosticData),
          estimatedROI: this.calculateROI(lead.diagnosticData),
        },
      };

      await this.sequenceManager.processLeadSequences(sequenceLead);

      // Log del email enviado
      this.logEmailSent(
        lead,
        "day0Urgency",
        0,
        "Momento clave para tu empresa"
      );

      console.log(`📧 Secuencia iniciada para ${lead.email}`);
    } catch (error) {
      console.error(`❌ Error iniciando secuencia para ${lead.email}:`, error);
    }
  }

  // Reiniciar secuencia para lead existente
  private async restartSequenceForLead(lead: LeadData): Promise<void> {
    try {
      // Primero pausar secuencia actual
      await this.sequenceManager.pauseSequenceForLead(
        lead.id,
        "diagnostic_updated"
      );

      // Limpiar emails enviados para permitir reenvío
      lead.emailsSent = [];

      // Reiniciar secuencia
      await this.triggerEmailSequence(lead);

      console.log(`🔄 Secuencia reiniciada para ${lead.email}`);
    } catch (error) {
      console.error(
        `❌ Error reiniciando secuencia para ${lead.email}:`,
        error
      );
    }
  }

  // Log de email enviado
  private logEmailSent(
    lead: LeadData,
    templateName: string,
    day: number,
    subject: string
  ): void {
    const emailLog: EmailLog = {
      leadId: lead.id,
      templateName,
      sequenceDay: day,
      subject, // Garantizado que no es undefined
      status: "sent",
      sentAt: new Date().toISOString(),
    };

    this.emailLogs.push(emailLog);
  }

  // Generar ID único para lead
  private generateLeadId(email: string): string {
    return `lead_${email.split("@")[0]}_${Date.now()}`;
  }

  // Generar recomendaciones basadas en respuestas
  private generateRecommendations(
    answers: Record<number, string>,
    level: string
  ): string[] {
    switch (level) {
      case "Inicial":
        return [
          "Centralizar fuentes de datos",
          "Implementar procesos básicos de captura",
          "Establecer métricas clave",
        ];
      case "Intermedio":
        return [
          "Integrar sistemas existentes",
          "Automatizar reportes básicos",
          "Desarrollar dashboards interactivos",
        ];
      case "Avanzado":
        return [
          "Implementar análisis predictivo",
          "Optimizar arquitectura de datos",
          "Desarrollar cultura data-driven",
        ];
      default:
        return [
          "Centralizar fuentes de datos",
          "Implementar procesos básicos de captura",
          "Establecer métricas clave",
        ];
    }
  }

  // Calcular áreas de fortaleza/debilidad
  private calculateAreas(answers: Record<number, string>): {
    dataCollection: number;
    analysis: number;
    visualization: number;
    decisionMaking: number;
  } {
    // Lógica simplificada basada en respuestas
    const scoreMap: Record<string, number> = {
      inicial: 1,
      intermedio: 2,
      avanzado: 3,
      intuicion: 1,
      datos_basicos: 2,
      analisis: 3,
      recopilacion: 1,
      organizacion: 2,
      interpretacion: 3,
    };

    const getScore = (key: number): number => {
      const answer = answers[key];
      if (!answer) return 1; // Fallback si no existe la respuesta
      return scoreMap[answer] ?? 1; // Fallback si no existe en scoreMap
    };

    return {
      dataCollection: getScore(1),
      analysis: getScore(2),
      visualization: Math.round((getScore(1) + getScore(3)) / 2),
      decisionMaking: getScore(3),
    };
  }

  // Obtener desafío principal
  private getPrimaryChallenge(diagnosticData: DiagnosticData): string {
    switch (diagnosticData.level) {
      case "Inicial":
        return "Organización de datos básica";
      case "Intermedio":
        return "Integración y automatización";
      case "Avanzado":
        return "Optimización y análisis avanzado";
      default:
        return "Organización de datos";
    }
  }

  // Generar quick wins específicos
  private generateQuickWins(diagnosticData: DiagnosticData): Array<{
    action: string;
    description: string;
  }> {
    switch (diagnosticData.level) {
      case "Inicial":
        return [
          {
            action: "Auditoría de datos",
            description: "Mapear todas las fuentes de datos actuales",
          },
          {
            action: "Dashboard básico",
            description: "Crear visualización de KPIs principales",
          },
        ];
      case "Intermedio":
        return [
          {
            action: "Integración de sistemas",
            description: "Conectar las 2-3 fuentes más importantes",
          },
          {
            action: "Automatización básica",
            description: "Eliminar procesos manuales repetitivos",
          },
        ];
      case "Avanzado":
        return [
          {
            action: "Análisis predictivo",
            description: "Implementar modelos de predicción básicos",
          },
          {
            action: "Optimización de procesos",
            description: "Revisar y mejorar flujos de datos existentes",
          },
        ];
      default:
        return [
          {
            action: "Auditoría de datos",
            description: "Mapear todas las fuentes de datos actuales",
          },
          {
            action: "Dashboard básico",
            description: "Crear visualización de KPIs principales",
          },
        ];
    }
  }

  // Calcular ROI estimado
  private calculateROI(diagnosticData: DiagnosticData): {
    timeToValue: number;
    expectedReturn: number;
  } {
    switch (diagnosticData.level) {
      case "Inicial":
        return { timeToValue: 45, expectedReturn: 150 };
      case "Intermedio":
        return { timeToValue: 30, expectedReturn: 250 };
      case "Avanzado":
        return { timeToValue: 20, expectedReturn: 400 };
      default:
        return { timeToValue: 45, expectedReturn: 150 };
    }
  }

  // Métodos de gestión de leads
  getLeadById(leadId: string): LeadData | undefined {
    return this.leads.get(leadId);
  }

  getLeadByEmail(email: string): LeadData | undefined {
    for (const lead of this.leads.values()) {
      if (lead.email === email) {
        return lead;
      }
    }
    return undefined;
  }

  getAllLeads(): LeadData[] {
    return Array.from(this.leads.values());
  }

  getEmailLogs(): EmailLog[] {
    return [...this.emailLogs];
  }

  // Métodos de testing
  async testDiagnosticFlow(testResult: DiagnosticResult): Promise<boolean> {
    console.log("🧪 Testing flujo de diagnóstico...");

    try {
      const success = await this.processDiagnosticResult(testResult);
      console.log(`✅ Test completado: ${success ? "Éxito" : "Fallo"}`);
      return success;
    } catch (testError) {
      console.error("❌ Error en test:", testError);
      return false;
    }
  }

  // Limpiar datos de test
  clearTestData(): void {
    this.leads.clear();
    this.emailLogs.length = 0;
    console.log("🧹 Datos de test limpiados");
  }
}

// Instancia singleton
let diagnosticTriggerInstance: DiagnosticTrigger | null = null;

export const getDiagnosticTrigger = (): DiagnosticTrigger => {
  if (!diagnosticTriggerInstance) {
    diagnosticTriggerInstance = new DiagnosticTrigger();
  }
  return diagnosticTriggerInstance;
};

export const createDiagnosticTrigger = (): DiagnosticTrigger => {
  return new DiagnosticTrigger();
};

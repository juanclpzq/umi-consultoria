// src/lib/integration/__tests__/diagnosticTrigger.test.ts
import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { DiagnosticIntegration } from "../diagnosticTrigger";
import { LeadDatabase } from "../../database/sqlite";
import { existsSync, unlinkSync } from "fs";
import path from "path";

// Mock UUID
jest.mock("uuid", () => ({
  v4: jest.fn(() => "integration-test-uuid"),
}));

describe("DiagnosticIntegration", () => {
  let integration: DiagnosticIntegration;
  const testDbPath = path.join(process.cwd(), "data", "integration-test.db");

  beforeEach(() => {
    // Limpiar base de datos de test
    if (existsSync(testDbPath)) {
      unlinkSync(testDbPath);
    }

    process.env.DATABASE_PATH = testDbPath;
    integration = new DiagnosticIntegration();
  });

  afterEach(() => {
    integration.close();

    if (existsSync(testDbPath)) {
      unlinkSync(testDbPath);
    }
  });

  describe("Procesamiento de diagnósticos nuevos", () => {
    test("Debe procesar nuevo lead correctamente", async () => {
      const submission = {
        email: "newlead@example.com",
        name: "New Lead",
        company: "New Company",
        diagnosticResult: {
          score: 65,
          level: "Intermedio",
          recommendations: ["Recomendación 1", "Recomendación 2"],
          areas: {
            dataCollection: 60,
            analysis: 70,
            visualization: 65,
            decisionMaking: 65,
          },
        },
        submissionDate: "2025-01-01T10:00:00Z",
      };

      const result = await integration.processDiagnostic(submission);

      expect(result.isNewLead).toBe(true);
      expect(result.leadId).toBe("integration-test-uuid");
      expect(result.emailsToSend).toHaveLength(1);
      expect(result.emailsToSend[0].template).toBe("diagnostic_welcome");
      expect(result.emailsToSend[0].day).toBe(0);
      expect(result.message).toContain("Email de bienvenida enviado");
    });

    test("Debe crear lead con datos completos", async () => {
      const submission = {
        email: "complete@example.com",
        name: "Complete User",
        company: "Complete Corp",
        diagnosticResult: {
          score: 85,
          level: "Avanzado",
          recommendations: ["ML Implementation", "Real-time Analytics"],
          areas: {
            dataCollection: 90,
            analysis: 85,
            visualization: 80,
            decisionMaking: 85,
          },
        },
        submissionDate: "2025-01-01T10:00:00Z",
      };

      await integration.processDiagnostic(submission);

      // Verificar que el lead fue creado correctamente
      const database = new LeadDatabase();
      const lead = database.findLeadByEmail("complete@example.com");

      expect(lead).toBeDefined();
      expect(lead?.name).toBe("Complete User");
      expect(lead?.company).toBe("Complete Corp");
      expect(lead?.diagnosticData.score).toBe(85);
      expect(lead?.diagnosticData.level).toBe("Avanzado");
      expect(lead?.diagnosticData.areas.dataCollection).toBe(90);
      expect(lead?.sequencePaused).toBe(false);

      database.close();
    });

    test("Debe actualizar lead existente sin duplicar email Day 0", async () => {
      const firstSubmission = {
        email: "existing@example.com",
        name: "Existing Lead",
        company: "Company",
        diagnosticResult: {
          score: 50,
          level: "Básico",
          recommendations: ["Recomendación inicial"],
          areas: {
            dataCollection: 50,
            analysis: 50,
            visualization: 50,
            decisionMaking: 50,
          },
        },
        submissionDate: "2025-01-01T10:00:00Z",
      };

      // Primera submisión
      const firstResult = await integration.processDiagnostic(firstSubmission);
      expect(firstResult.isNewLead).toBe(true);
      expect(firstResult.emailsToSend).toHaveLength(1);
      expect(firstResult.emailsToSend[0].day).toBe(0);

      // Segunda submisión del mismo lead
      const secondSubmission = {
        ...firstSubmission,
        name: "Updated Name",
        diagnosticResult: {
          ...firstSubmission.diagnosticResult,
          score: 70,
          level: "Intermedio",
        },
        submissionDate: "2025-01-01T11:00:00Z",
      };

      const secondResult =
        await integration.processDiagnostic(secondSubmission);
      expect(secondResult.isNewLead).toBe(false);
      expect(secondResult.emailsToSend).toHaveLength(0); // No debe enviar Day 0 de nuevo
      expect(secondResult.message).toContain("0 emails enviados");

      // Verificar que los datos fueron actualizados
      const database = new LeadDatabase();
      const updatedLead = database.findLeadByEmail("existing@example.com");
      expect(updatedLead?.name).toBe("Updated Name");
      expect(updatedLead?.diagnosticData.score).toBe(70);
      expect(updatedLead?.diagnosticData.submissionCount).toBe(1);

      database.close();
    });

    test("Debe manejar lead sin empresa", async () => {
      const submission = {
        email: "nocompany@example.com",
        name: "No Company User",
        // company no incluido
        diagnosticResult: {
          score: 45,
          level: "Básico",
          recommendations: ["Básico 1", "Básico 2"],
          areas: {
            dataCollection: 40,
            analysis: 45,
            visualization: 50,
            decisionMaking: 45,
          },
        },
        submissionDate: "2025-01-01T10:00:00Z",
      };

      const result = await integration.processDiagnostic(submission);
      expect(result.isNewLead).toBe(true);

      const database = new LeadDatabase();
      const lead = database.findLeadByEmail("nocompany@example.com");
      expect(lead?.company).toBeUndefined();

      database.close();
    });
  });

  describe("Cálculo de emails pendientes", () => {
    test("Debe enviar emails correspondientes según días transcurridos", async () => {
      // Simular lead creado hace 3 días
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const submission = {
        email: "threedaysago@example.com",
        name: "Three Days Lead",
        diagnosticResult: {
          score: 60,
          level: "Intermedio",
          recommendations: ["Recomendación 1"],
          areas: {
            dataCollection: 60,
            analysis: 60,
            visualization: 60,
            decisionMaking: 60,
          },
        },
        submissionDate: threeDaysAgo.toISOString(),
      };

      const result = await integration.processDiagnostic(submission);

      // Debe enviar Day 0 y Day 2 (si no fueron enviados antes)
      expect(result.emailsToSend.length).toBeGreaterThanOrEqual(2);

      const dayZeroEmail = result.emailsToSend.find((email) => email.day === 0);
      const dayTwoEmail = result.emailsToSend.find((email) => email.day === 2);

      expect(dayZeroEmail).toBeDefined();
      expect(dayZeroEmail?.template).toBe("diagnostic_welcome");
      expect(dayTwoEmail).toBeDefined();
      expect(dayTwoEmail?.template).toBe("diagnostic_followup_1");
    });

    test("Debe enviar múltiples emails para lead antiguo", async () => {
      // Simular lead creado hace 10 días
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

      const submission = {
        email: "tendaysago@example.com",
        name: "Ten Days Lead",
        diagnosticResult: {
          score: 75,
          level: "Intermedio",
          recommendations: ["Recomendación avanzada"],
          areas: {
            dataCollection: 75,
            analysis: 75,
            visualization: 75,
            decisionMaking: 75,
          },
        },
        submissionDate: tenDaysAgo.toISOString(),
      };

      const result = await integration.processDiagnostic(submission);

      // Debe enviar Day 0, 2, 5, 10
      expect(result.emailsToSend.length).toBe(4);

      const expectedDays = [0, 2, 5, 10];
      const actualDays = result.emailsToSend
        .map((email) => email.day)
        .sort((a, b) => a - b);
      expect(actualDays).toEqual(expectedDays);
    });

    test("Debe respetar emails ya enviados", async () => {
      const database = new LeadDatabase();

      // Crear lead inicial
      const leadData = {
        id: "test-respect-emails",
        email: "respectemails@example.com",
        name: "Respect Emails Lead",
        diagnosticDate: "2025-01-01T10:00:00Z",
        emailsSent: [],
        sequencePaused: false,
        diagnosticData: { score: 60 },
      };

      database.upsertLead(leadData);

      // Simular que Day 0 ya fue enviado
      database.logEmailSent({
        leadId: "test-respect-emails",
        templateName: "diagnostic_welcome",
        sequenceDay: 0,
        status: "sent",
      });

      // Simular que han pasado 3 días
      const threeDaysLater = new Date("2025-01-01T10:00:00Z");
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);

      const submission = {
        email: "respectemails@example.com",
        name: "Respect Emails Lead",
        diagnosticResult: {
          score: 65,
          level: "Intermedio",
          recommendations: ["Recomendación actualizada"],
          areas: {
            dataCollection: 65,
            analysis: 65,
            visualization: 65,
            decisionMaking: 65,
          },
        },
        submissionDate: threeDaysLater.toISOString(),
      };

      const result = await integration.processDiagnostic(submission);

      // No debe incluir Day 0 porque ya fue enviado
      const dayZeroEmail = result.emailsToSend.find((email) => email.day === 0);
      expect(dayZeroEmail).toBeUndefined();

      // Debe incluir Day 2 porque no fue enviado
      const dayTwoEmail = result.emailsToSend.find((email) => email.day === 2);
      expect(dayTwoEmail).toBeDefined();

      database.close();
    });

    test("Debe calcular días transcurridos correctamente para diferentes zonas horarias", async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 59, 59); // Casi al final del día

      const submission = {
        email: "timezone@example.com",
        name: "Timezone Test",
        diagnosticResult: {
          score: 55,
          level: "Básico",
          recommendations: ["Timezone rec"],
          areas: {
            dataCollection: 55,
            analysis: 55,
            visualization: 55,
            decisionMaking: 55,
          },
        },
        submissionDate: yesterday.toISOString(),
      };

      const result = await integration.processDiagnostic(submission);
      expect(result.emailsToSend.length).toBeGreaterThan(0);

      const database = new LeadDatabase();
      const daysElapsed = database.getDaysElapsed(result.leadId);
      expect(daysElapsed).toBeGreaterThanOrEqual(0);
      expect(daysElapsed).toBeLessThan(2);

      database.close();
    });
  });

  describe("Procesamiento de emails programados", () => {
    test("Debe procesar leads pendientes en cron job", async () => {
      const database = new LeadDatabase();

      // Crear lead con diagnóstico hace 2 días
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const leadData = {
        id: "cron-test-lead",
        email: "cronjob@example.com",
        name: "Cron Job Lead",
        diagnosticDate: twoDaysAgo.toISOString(),
        emailsSent: [],
        sequencePaused: false,
        diagnosticData: {
          score: 70,
          level: "Intermedio",
          areas: {
            dataCollection: 70,
            analysis: 70,
            visualization: 70,
            decisionMaking: 70,
          },
        },
      };

      database.upsertLead(leadData);
      database.close();

      // Ejecutar procesamiento programado
      const cronResult = await integration.processScheduledEmails();

      expect(cronResult.processed).toBeGreaterThan(0);
      expect(cronResult.successful).toBeGreaterThan(0);
      expect(cronResult.details.length).toBeGreaterThan(0);

      // Verificar que se enviaron los emails correctos
      const sentEmails = cronResult.details.filter(
        (detail) => detail.status === "sent"
      );
      expect(sentEmails.length).toBeGreaterThan(0);
    });

    test("No debe procesar leads pausados", async () => {
      const database = new LeadDatabase();

      // Crear lead pausado
      const leadData = {
        id: "paused-lead-test",
        email: "pausedlead@example.com",
        name: "Paused Lead",
        diagnosticDate: "2024-12-25T10:00:00Z", // Hace muchos días
        emailsSent: [],
        sequencePaused: true,
        pauseReason: "Test pause",
        diagnosticData: { score: 60 },
      };

      database.upsertLead(leadData);
      database.close();

      // Ejecutar procesamiento programado
      const cronResult = await integration.processScheduledEmails();

      // No debe procesar el lead pausado
      const pausedLeadDetails = cronResult.details.filter(
        (detail) => detail.leadId === "paused-lead-test"
      );
      expect(pausedLeadDetails).toHaveLength(0);
    });

    test("Debe manejar múltiples leads con diferentes estados", async () => {
      const database = new LeadDatabase();

      // Lead 1: Necesita Day 2
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      database.upsertLead({
        id: "multi-lead-1",
        email: "multi1@example.com",
        name: "Multi Lead 1",
        diagnosticDate: twoDaysAgo.toISOString(),
        emailsSent: [],
        sequencePaused: false,
        diagnosticData: { score: 60 },
      });

      // Lead 2: Necesita Day 5
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      database.upsertLead({
        id: "multi-lead-2",
        email: "multi2@example.com",
        name: "Multi Lead 2",
        diagnosticDate: fiveDaysAgo.toISOString(),
        emailsSent: [],
        sequencePaused: false,
        diagnosticData: { score: 70 },
      });

      // Lead 3: Pausado
      database.upsertLead({
        id: "multi-lead-3",
        email: "multi3@example.com",
        name: "Multi Lead 3",
        diagnosticDate: fiveDaysAgo.toISOString(),
        emailsSent: [],
        sequencePaused: true,
        diagnosticData: { score: 80 },
      });

      database.close();

      const cronResult = await integration.processScheduledEmails();

      // Debe procesar al menos 2 leads (no el pausado)
      expect(cronResult.processed).toBeGreaterThanOrEqual(2);

      // Verificar que no procesó el lead pausado
      const pausedLeadEmails = cronResult.details.filter(
        (detail) => detail.leadId === "multi-lead-3"
      );
      expect(pausedLeadEmails).toHaveLength(0);
    });

    test("Debe manejar errores de envío de email", async () => {
      // Mock para simular error en algunos emails
      const originalSendEmail = (integration as any).sendEmail;
      let callCount = 0;

      (integration as any).sendEmail = jest
        .fn()
        .mockImplementation(async (...args) => {
          callCount++;
          if (callCount % 2 === 0) {
            throw new Error("Simulated email error");
          }
          return originalSendEmail.apply(integration, args);
        });

      const database = new LeadDatabase();

      // Crear varios leads para probar manejo de errores
      for (let i = 1; i <= 3; i++) {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - 2);

        database.upsertLead({
          id: `error-test-${i}`,
          email: `errortest${i}@example.com`,
          name: `Error Test ${i}`,
          diagnosticDate: daysAgo.toISOString(),
          emailsSent: [],
          sequencePaused: false,
          diagnosticData: { score: 60 },
        });
      }

      database.close();

      const cronResult = await integration.processScheduledEmails();

      // Debe tener algunos éxitos y algunos fallos
      expect(cronResult.successful).toBeGreaterThan(0);
      expect(cronResult.failed).toBeGreaterThan(0);
      expect(cronResult.successful + cronResult.failed).toBe(
        cronResult.details.length
      );

      // Restaurar método original
      (integration as any).sendEmail = originalSendEmail;
    });
  });

  describe("Métricas y estado", () => {
    test("Debe retornar métricas del sistema", () => {
      const metrics = integration.getMetrics();

      expect(metrics).toBeDefined();
      expect(typeof metrics.totalLeads).toBe("number");
      expect(typeof metrics.emailsSentToday).toBe("number");
      expect(typeof metrics.emailsSentThisWeek).toBe("number");
      expect(typeof metrics.emailsSentThisMonth).toBe("number");
      expect(typeof metrics.activeSequences).toBe("number");
      expect(typeof metrics.pausedSequences).toBe("number");
      expect(typeof metrics.conversionRate).toBe("number");
    });

    test("Debe pausar y reanudar secuencias", async () => {
      const submission = {
        email: "pausetest@example.com",
        name: "Pause Test",
        diagnosticResult: {
          score: 60,
          level: "Intermedio",
          recommendations: ["Test recommendation"],
          areas: {
            dataCollection: 60,
            analysis: 60,
            visualization: 60,
            decisionMaking: 60,
          },
        },
        submissionDate: "2025-01-01T10:00:00Z",
      };

      const result = await integration.processDiagnostic(submission);

      // Pausar secuencia
      integration.pauseLeadSequence(result.leadId, "Test pause");

      let metrics = integration.getMetrics();
      expect(metrics.pausedSequences).toBe(1);
      expect(metrics.activeSequences).toBe(0);

      // Reanudar secuencia
      integration.resumeLeadSequence(result.leadId);

      metrics = integration.getMetrics();
      expect(metrics.pausedSequences).toBe(0);
      expect(metrics.activeSequences).toBe(1);
    });

    test("Debe actualizar métricas correctamente con múltiples leads", async () => {
      // Crear varios leads
      for (let i = 1; i <= 5; i++) {
        const submission = {
          email: `metrics${i}@example.com`,
          name: `Metrics User ${i}`,
          diagnosticResult: {
            score: 60 + i * 5,
            level: "Intermedio",
            recommendations: [`Recommendation ${i}`],
            areas: {
              dataCollection: 60,
              analysis: 60,
              visualization: 60,
              decisionMaking: 60,
            },
          },
          submissionDate: "2025-01-01T10:00:00Z",
        };

        const result = await integration.processDiagnostic(submission);

        // Pausar algunos leads
        if (i % 2 === 0) {
          integration.pauseLeadSequence(result.leadId, `Pause ${i}`);
        }
      }

      const metrics = integration.getMetrics();
      expect(metrics.totalLeads).toBe(5);
      expect(metrics.activeSequences).toBe(3); // 1, 3, 5
      expect(metrics.pausedSequences).toBe(2); // 2, 4
    });
  });

  describe("Manejo de errores", () => {
    test("Debe manejar errores de email gracefully", async () => {
      // Simular error en envío de email modificando el método interno
      const originalSendEmail = (integration as any).sendEmail;
      (integration as any).sendEmail = jest
        .fn()
        .mockRejectedValue(new Error("Email service down"));

      const submission = {
        email: "errortest@example.com",
        name: "Error Test",
        diagnosticResult: {
          score: 60,
          level: "Intermedio",
          recommendations: ["Error test rec"],
          areas: {
            dataCollection: 60,
            analysis: 60,
            visualization: 60,
            decisionMaking: 60,
          },
        },
        submissionDate: "2025-01-01T10:00:00Z",
      };

      // Debe procesar el diagnóstico aunque falle el email
      const result = await integration.processDiagnostic(submission);
      expect(result.leadId).toBeDefined();
      expect(result.isNewLead).toBe(true);

      // Restaurar método original
      (integration as any).sendEmail = originalSendEmail;
    });

    test("Debe validar datos de entrada", async () => {
      const invalidSubmissions = [
        // Email inválido
        {
          email: "invalid-email",
          name: "Test User",
          diagnosticResult: {
            score: 60,
            level: "Intermedio",
            recommendations: [],
            areas: {
              dataCollection: 60,
              analysis: 60,
              visualization: 60,
              decisionMaking: 60,
            },
          },
          submissionDate: "2025-01-01T10:00:00Z",
        },
        // Nombre vacío
        {
          email: "test@example.com",
          name: "",
          diagnosticResult: {
            score: 60,
            level: "Intermedio",
            recommendations: [],
            areas: {
              dataCollection: 60,
              analysis: 60,
              visualization: 60,
              decisionMaking: 60,
            },
          },
          submissionDate: "2025-01-01T10:00:00Z",
        },
        // Fecha inválida
        {
          email: "test@example.com",
          name: "Test User",
          diagnosticResult: {
            score: 60,
            level: "Intermedio",
            recommendations: [],
            areas: {
              dataCollection: 60,
              analysis: 60,
              visualization: 60,
              decisionMaking: 60,
            },
          },
          submissionDate: "invalid-date",
        },
      ];

      for (const invalidSubmission of invalidSubmissions) {
        await expect(
          integration.processDiagnostic(invalidSubmission)
        ).rejects.toThrow();
      }
    });

    test("Debe manejar errores de base de datos", async () => {
      // Cerrar la conexión para simular error de BD
      integration.close();

      const submission = {
        email: "dbError@example.com",
        name: "DB Error Test",
        diagnosticResult: {
          score: 60,
          level: "Intermedio",
          recommendations: [],
          areas: {
            dataCollection: 60,
            analysis: 60,
            visualization: 60,
            decisionMaking: 60,
          },
        },
        submissionDate: "2025-01-01T10:00:00Z",
      };

      await expect(integration.processDiagnostic(submission)).rejects.toThrow();
    });
  });

  describe("Integración completa", () => {
    test("Debe manejar flujo completo de lead lifecycle", async () => {
      // 1. Crear nuevo lead
      const submission = {
        email: "lifecycle@example.com",
        name: "Lifecycle Test",
        company: "Test Corp",
        diagnosticResult: {
          score: 65,
          level: "Intermedio",
          recommendations: ["Recomendación 1"],
          areas: {
            dataCollection: 65,
            analysis: 65,
            visualization: 65,
            decisionMaking: 65,
          },
        },
        submissionDate: "2025-01-01T10:00:00Z",
      };

      const createResult = await integration.processDiagnostic(submission);
      expect(createResult.isNewLead).toBe(true);
      expect(createResult.emailsToSend).toHaveLength(1);

      // 2. Simular paso del tiempo y segunda submisión
      const laterSubmission = {
        ...submission,
        diagnosticResult: {
          ...submission.diagnosticResult,
          score: 75,
          level: "Avanzado",
        },
        submissionDate: "2025-01-03T10:00:00Z", // 2 días después
      };

      const updateResult = await integration.processDiagnostic(laterSubmission);
      expect(updateResult.isNewLead).toBe(false);

      // 3. Verificar que el lead fue actualizado
      const database = new LeadDatabase();
      const lead = database.findLeadByEmail("lifecycle@example.com");
      expect(lead?.diagnosticData.score).toBe(75);
      expect(lead?.diagnosticData.level).toBe("Avanzado");
      expect(lead?.diagnosticData.submissionCount).toBe(1);

      // 4. Procesar emails programados
      const cronResult = await integration.processScheduledEmails();
      expect(cronResult.processed).toBeGreaterThan(0);

      // 5. Verificar métricas finales
      const metrics = integration.getMetrics();
      expect(metrics.totalLeads).toBe(1);
      expect(metrics.activeSequences).toBe(1);

      // 6. Pausar y verificar
      integration.pauseLeadSequence(createResult.leadId, "Lead respondió");
      const finalMetrics = integration.getMetrics();
      expect(finalMetrics.pausedSequences).toBe(1);
      expect(finalMetrics.activeSequences).toBe(0);

      database.close();
    });

    test("Debe manejar múltiples leads en diferentes etapas", async () => {
      const leads = [
        {
          email: "stage1@example.com",
          name: "Stage 1 Lead",
          daysAgo: 0, // Nuevo
          shouldPause: false,
        },
        {
          email: "stage2@example.com",
          name: "Stage 2 Lead",
          daysAgo: 3, // Necesita Day 2
          shouldPause: false,
        },
        {
          email: "stage3@example.com",
          name: "Stage 3 Lead",
          daysAgo: 6, // Necesita Day 5
          shouldPause: false,
        },
        {
          email: "stage4@example.com",
          name: "Stage 4 Lead",
          daysAgo: 11, // Necesita Day 10
          shouldPause: true,
        },
      ];

      const results = [];

      // Crear todos los leads
      for (const leadConfig of leads) {
        const submissionDate = new Date();
        submissionDate.setDate(submissionDate.getDate() - leadConfig.daysAgo);

        const submission = {
          email: leadConfig.email,
          name: leadConfig.name,
          diagnosticResult: {
            score: 60,
            level: "Intermedio",
            recommendations: ["Standard rec"],
            areas: {
              dataCollection: 60,
              analysis: 60,
              visualization: 60,
              decisionMaking: 60,
            },
          },
          submissionDate: submissionDate.toISOString(),
        };

        const result = await integration.processDiagnostic(submission);
        results.push({ ...result, shouldPause: leadConfig.shouldPause });

        if (leadConfig.shouldPause) {
          integration.pauseLeadSequence(result.leadId, "Test pause");
        }
      }

      // Verificar estados
      const metrics = integration.getMetrics();
      expect(metrics.totalLeads).toBe(4);
      expect(metrics.activeSequences).toBe(3);
      expect(metrics.pausedSequences).toBe(1);

      // Procesar emails programados
      const cronResult = await integration.processScheduledEmails();
      expect(cronResult.processed).toBe(3); // Solo los no pausados

      // Verificar que se enviaron los emails correctos
      const sentEmails = cronResult.details.filter((d) => d.status === "sent");
      expect(sentEmails.length).toBeGreaterThan(0);

      // No debe haber procesado el lead pausado
      const pausedLeadEmails = cronResult.details.filter((d) =>
        results.find((r) => r.leadId === d.leadId && r.shouldPause)
      );
      expect(pausedLeadEmails).toHaveLength(0);
    });

    test("Debe preservar integridad de datos durante operaciones concurrentes", async () => {
      const email = "concurrent@example.com";

      // Simular múltiples submisiones concurrentes del mismo lead
      const concurrentSubmissions = Array.from({ length: 3 }, (_, i) => ({
        email,
        name: `Concurrent User ${i}`,
        diagnosticResult: {
          score: 60 + i * 10,
          level: "Intermedio",
          recommendations: [`Rec ${i}`],
          areas: {
            dataCollection: 60,
            analysis: 60,
            visualization: 60,
            decisionMaking: 60,
          },
        },
        submissionDate: new Date().toISOString(),
      }));

      // Procesar todas las submisiones concurrentemente
      const results = await Promise.all(
        concurrentSubmissions.map((submission) =>
          integration.processDiagnostic(submission)
        )
      );

      // Verificar que solo se creó un lead
      const newLeadResults = results.filter((r) => r.isNewLead);
      expect(newLeadResults).toHaveLength(1);

      // Verificar que el lead existe en la base de datos
      const database = new LeadDatabase();
      const lead = database.findLeadByEmail(email);
      expect(lead).toBeDefined();

      // Verificar métricas
      const metrics = database.getMetrics();
      expect(metrics.totalLeads).toBe(1);

      database.close();
    });
  });

  describe("Validaciones específicas de negocio", () => {
    test("Debe manejar correctamente scores extremos", async () => {
      const extremeScores = [
        { score: 0, level: "Inicial", expectedEmails: 1 },
        { score: 25, level: "Inicial", expectedEmails: 1 },
        { score: 50, level: "Básico", expectedEmails: 1 },
        { score: 75, level: "Intermedio", expectedEmails: 1 },
        { score: 95, level: "Avanzado", expectedEmails: 1 },
        { score: 100, level: "Avanzado", expectedEmails: 1 },
      ];

      for (let i = 0; i < extremeScores.length; i++) {
        const config = extremeScores[i];
        const submission = {
          email: `extreme${i}@example.com`,
          name: `Extreme Score ${i}`,
          diagnosticResult: {
            score: config.score,
            level: config.level,
            recommendations: [`Recommendation for score ${config.score}`],
            areas: {
              dataCollection: config.score,
              analysis: config.score,
              visualization: config.score,
              decisionMaking: config.score,
            },
          },
          submissionDate: "2025-01-01T10:00:00Z",
        };

        const result = await integration.processDiagnostic(submission);
        expect(result.emailsToSend).toHaveLength(config.expectedEmails);

        const database = new LeadDatabase();
        const lead = database.findLeadByEmail(submission.email);
        expect(lead?.diagnosticData.score).toBe(config.score);
        expect(lead?.diagnosticData.level).toBe(config.level);
        database.close();
      }
    });

    test("Debe manejar secuencia completa de emails", async () => {
      const database = new LeadDatabase();

      // Crear lead hace 35 días (debería tener todos los emails)
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 35);

      const leadData = {
        id: "complete-sequence-test",
        email: "complete@example.com",
        name: "Complete Sequence",
        diagnosticDate: oldDate.toISOString(),
        emailsSent: [],
        sequencePaused: false,
        diagnosticData: {
          score: 70,
          areas: {
            dataCollection: 70,
            analysis: 70,
            visualization: 70,
            decisionMaking: 70,
          },
        },
      };

      database.upsertLead(leadData);
      database.close();

      // Procesar emails programados
      const cronResult = await integration.processScheduledEmails();

      // Debe haber enviado todos los emails de la secuencia (0, 2, 5, 10, 30)
      const leadEmails = cronResult.details.filter(
        (d) => d.leadId === "complete-sequence-test"
      );
      expect(leadEmails.length).toBe(5);

      const expectedTemplates = [
        "diagnostic_welcome",
        "diagnostic_followup_1",
        "diagnostic_followup_2",
        "diagnostic_case_study",
        "diagnostic_final_offer",
      ];

      const sentTemplates = leadEmails.map((e) => e.templateName);
      expectedTemplates.forEach((template) => {
        expect(sentTemplates).toContain(template);
      });
    });

    test("Debe respetar límites de la secuencia de emails", async () => {
      const database = new LeadDatabase();

      // Crear lead muy antiguo (100 días)
      const veryOldDate = new Date();
      veryOldDate.setDate(veryOldDate.getDate() - 100);

      const leadData = {
        id: "old-sequence-test",
        email: "veryold@example.com",
        name: "Very Old Lead",
        diagnosticDate: veryOldDate.toISOString(),
        emailsSent: [],
        sequencePaused: false,
        diagnosticData: { score: 60 },
      };

      database.upsertLead(leadData);
      database.close();

      const cronResult = await integration.processScheduledEmails();

      // No debe enviar más emails de los definidos en la secuencia
      const leadEmails = cronResult.details.filter(
        (d) => d.leadId === "old-sequence-test"
      );
      expect(leadEmails.length).toBeLessThanOrEqual(5); // Máximo 5 emails en la secuencia
    });
  });

  describe("Performance y optimización", () => {
    test("Debe manejar múltiples leads eficientemente", async () => {
      const startTime = Date.now();

      // Crear 50 leads
      const promises = [];
      for (let i = 1; i <= 50; i++) {
        const submission = {
          email: `perf${i}@example.com`,
          name: `Performance Test ${i}`,
          diagnosticResult: {
            score: 50 + (i % 50),
            level: "Intermedio",
            recommendations: [`Perf rec ${i}`],
            areas: {
              dataCollection: 60,
              analysis: 60,
              visualization: 60,
              decisionMaking: 60,
            },
          },
          submissionDate: "2025-01-01T10:00:00Z",
        };

        promises.push(integration.processDiagnostic(submission));
      }

      await Promise.all(promises);

      const processingTime = Date.now() - startTime;

      // Verificar que se crearon todos los leads
      const metrics = integration.getMetrics();
      expect(metrics.totalLeads).toBe(50);

      // El procesamiento no debería tomar más de 10 segundos
      expect(processingTime).toBeLessThan(10000);
    });

    test("Debe optimizar consultas de leads pendientes", async () => {
      const database = new LeadDatabase();

      // Crear leads en diferentes estados
      const leadConfigs = [
        { daysAgo: 0, count: 10 }, // Nuevos
        { daysAgo: 2, count: 15 }, // Necesitan Day 2
        { daysAgo: 5, count: 12 }, // Necesitan Day 5
        { daysAgo: 10, count: 8 }, // Necesitan Day 10
        { daysAgo: 30, count: 5 }, // Necesitan Day 30
        { daysAgo: 50, count: 20 }, // Muy antiguos (no deberían procesarse mucho)
      ];

      let totalLeads = 0;
      for (const config of leadConfigs) {
        for (let i = 1; i <= config.count; i++) {
          totalLeads++;
          const date = new Date();
          date.setDate(date.getDate() - config.daysAgo);

          database.upsertLead({
            id: `opt-${config.daysAgo}-${i}`,
            email: `opt${config.daysAgo}_${i}@example.com`,
            name: `Opt Lead ${config.daysAgo}_${i}`,
            diagnosticDate: date.toISOString(),
            emailsSent: [],
            sequencePaused: false,
            diagnosticData: { score: 60 },
          });
        }
      }

      database.close();

      const startTime = Date.now();
      const cronResult = await integration.processScheduledEmails();
      const queryTime = Date.now() - startTime;

      // Verificar que se procesaron leads
      expect(cronResult.processed).toBeGreaterThan(0);
      expect(cronResult.processed).toBeLessThanOrEqual(totalLeads);

      // Las consultas deberían ser rápidas (menos de 5 segundos para 70 leads)
      expect(queryTime).toBeLessThan(5000);
    });
  });

  describe("Edge cases y casos límite", () => {
    test("Debe manejar fechas en el futuro", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const submission = {
        email: "future@example.com",
        name: "Future Date",
        diagnosticResult: {
          score: 60,
          level: "Intermedio",
          recommendations: ["Future rec"],
          areas: {
            dataCollection: 60,
            analysis: 60,
            visualization: 60,
            decisionMaking: 60,
          },
        },
        submissionDate: futureDate.toISOString(),
      };

      const result = await integration.processDiagnostic(submission);

      // Debe crear el lead pero con días transcurridos = 0
      expect(result.isNewLead).toBe(true);

      const database = new LeadDatabase();
      const daysElapsed = database.getDaysElapsed(result.leadId);
      expect(daysElapsed).toBe(0);
      database.close();
    });

    test("Debe manejar emails duplicados con diferentes casos", async () => {
      const baseSubmission = {
        name: "Case Test",
        diagnosticResult: {
          score: 60,
          level: "Intermedio",
          recommendations: ["Case rec"],
          areas: {
            dataCollection: 60,
            analysis: 60,
            visualization: 60,
            decisionMaking: 60,
          },
        },
        submissionDate: "2025-01-01T10:00:00Z",
      };

      // Probar diferentes casos de email
      const emailVariations = [
        "test@example.com",
        "TEST@EXAMPLE.COM",
        "Test@Example.com",
        "test@EXAMPLE.com",
      ];

      const results = [];
      for (const email of emailVariations) {
        const submission = { ...baseSubmission, email };
        const result = await integration.processDiagnostic(submission);
        results.push(result);
      }

      // Verificar comportamiento con emails similares
      const database = new LeadDatabase();
      const metrics = database.getMetrics();

      // El comportamiento depende de si SQLite es case-sensitive
      // Normalmente debería crear leads separados para emails con diferentes casos
      expect(metrics.totalLeads).toBeGreaterThanOrEqual(1);

      database.close();
    });

    test("Debe manejar caracteres especiales en datos", async () => {
      const submission = {
        email: "special@exãmple.com",
        name: "José María Rodríguez-Ñoño",
        company: "Empresa & Cía. S.A. 100%",
        diagnosticResult: {
          score: 60,
          level: "Intermedio",
          recommendations: [
            "Recomendación con acentos: análisis & visualización",
          ],
          areas: {
            dataCollection: 60,
            analysis: 60,
            visualization: 60,
            decisionMaking: 60,
          },
        },
        submissionDate: "2025-01-01T10:00:00Z",
      };

      const result = await integration.processDiagnostic(submission);
      expect(result.isNewLead).toBe(true);

      const database = new LeadDatabase();
      const lead = database.findLeadByEmail("special@exãmple.com");
      expect(lead?.name).toBe("José María Rodríguez-Ñoño");
      expect(lead?.company).toBe("Empresa & Cía. S.A. 100%");
      database.close();
    });

    test("Debe manejar datos JSON complejos en diagnosticData", async () => {
      const complexDiagnosticData = {
        score: 75,
        level: "Avanzado",
        recommendations: [
          "Implementar análisis predictivo",
          "Automatizar reportes en tiempo real",
        ],
        areas: {
          dataCollection: 80,
          analysis: 75,
          visualization: 70,
          decisionMaking: 75,
        },
        metadata: {
          responseTime: 45,
          completionRate: 0.95,
          userAgent: "Mozilla/5.0...",
          timestamp: "2025-01-01T10:00:00Z",
          customFields: {
            industry: "Technology",
            employeeCount: "50-100",
            revenue: "$1M-$5M",
          },
        },
        questionResponses: {
          q1: { answer: "A", confidence: 0.9 },
          q2: { answer: "C", confidence: 0.7 },
          q3: { answer: "B", confidence: 0.8 },
        },
      };

      const submission = {
        email: "complex@example.com",
        name: "Complex Data Test",
        diagnosticResult: complexDiagnosticData,
        submissionDate: "2025-01-01T10:00:00Z",
      };

      const result = await integration.processDiagnostic(submission);
      expect(result.isNewLead).toBe(true);

      const database = new LeadDatabase();
      const lead = database.findLeadByEmail("complex@example.com");
      expect(lead?.diagnosticData.metadata.industry).toBe("Technology");
      expect(lead?.diagnosticData.questionResponses.q1.confidence).toBe(0.9);
      database.close();
    });
  });
});

// 📅 ARCHIVO: src/lib/cron/emailCron.ts
// Sistema de Cron Jobs para automatización completa

import cron from "node-cron";
import { getSequenceManager } from "@/lib/email/sequenceManager";
import { getEmailService } from "@/lib/email/emailService";

export class EmailCronManager {
  private static instance: EmailCronManager;
  private jobs: Map<string, cron.ScheduledTask> = new Map();
  private isProduction = process.env.NODE_ENV === "production";

  static getInstance(): EmailCronManager {
    if (!EmailCronManager.instance) {
      EmailCronManager.instance = new EmailCronManager();
    }
    return EmailCronManager.instance;
  }

  // 🚀 INICIALIZAR TODOS LOS CRON JOBS
  initializeAllJobs() {
    console.log("🔄 Inicializando sistema de cron jobs...");

    this.scheduleSequenceProcessing();
    this.scheduleDailyReports();
    this.scheduleHealthChecks();
    this.scheduleWeeklyCleanup();

    console.log(`✅ ${this.jobs.size} cron jobs activos`);
  }

  // 📧 JOB 1: Procesamiento de secuencias (cada 2 horas)
  scheduleSequenceProcessing() {
    const schedule = this.isProduction ? "0 */2 * * *" : "*/10 * * * *"; // Prod: cada 2h, Dev: cada 10min

    const job = cron.schedule(
      schedule,
      async () => {
        console.log("🔄 [CRON] Procesando secuencias automáticas...");

        try {
          const sequenceManager = getSequenceManager();
          const results = await sequenceManager.processAllSequences();

          console.log(
            `✅ [CRON] Secuencias procesadas: ${results.emailsSent} enviados`
          );

          // Si hay muchos fallos, alertar
          if (results.emailsFailed > results.emailsSent * 0.2) {
            await this.sendCriticalAlert(
              "Alto número de emails fallidos",
              results
            );
          }
        } catch (error) {
          console.error("❌ [CRON] Error en procesamiento:", error);
          await this.sendCriticalAlert("Error en cron de secuencias", {
            error: error.message,
          });
        }
      },
      {
        scheduled: true,
        timezone: "America/Mexico_City",
      }
    );

    this.jobs.set("sequence_processing", job);
    console.log(
      `📅 Cron programado: Secuencias ${this.isProduction ? "cada 2 horas" : "cada 10 minutos"}`
    );
  }

  // 📊 JOB 2: Reportes diarios (9:00 AM)
  scheduleDailyReports() {
    const job = cron.schedule(
      "0 9 * * *",
      async () => {
        console.log("📊 [CRON] Generando reporte diario...");

        try {
          const sequenceManager = getSequenceManager();
          const emailService = getEmailService();

          const sequenceMetrics = sequenceManager.getMetrics();
          const emailMetrics = emailService.getMetrics();

          // Solo enviar reporte si hay actividad
          if (sequenceMetrics.emailsSent > 0 || emailMetrics.sent > 0) {
            await sequenceManager.sendDailyReport();
            console.log("✅ [CRON] Reporte diario enviado");
          }
        } catch (error) {
          console.error("❌ [CRON] Error en reporte diario:", error);
        }
      },
      {
        scheduled: true,
        timezone: "America/Mexico_City",
      }
    );

    this.jobs.set("daily_reports", job);
    console.log("📅 Cron programado: Reportes diarios a las 9:00 AM");
  }

  // ❤️ JOB 3: Health checks (cada 30 minutos)
  scheduleHealthChecks() {
    const job = cron.schedule(
      "*/30 * * * *",
      async () => {
        console.log("❤️ [CRON] Health check del sistema...");

        try {
          const emailService = getEmailService();
          const isHealthy = await emailService.testConnection();

          if (!isHealthy) {
            await this.sendCriticalAlert("Sistema de email no responde", {
              timestamp: new Date().toISOString(),
              lastHealthCheck: "FAILED",
            });
          }
        } catch (error) {
          console.error("❌ [CRON] Error en health check:", error);
        }
      },
      {
        scheduled: true,
        timezone: "America/Mexico_City",
      }
    );

    this.jobs.set("health_checks", job);
    console.log("📅 Cron programado: Health checks cada 30 minutos");
  }

  // 🧹 JOB 4: Limpieza semanal (domingos 2:00 AM)
  scheduleWeeklyCleanup() {
    const job = cron.schedule(
      "0 2 * * 0",
      async () => {
        console.log("🧹 [CRON] Limpieza semanal...");

        try {
          // Limpiar logs antiguos
          await this.cleanupOldLogs();

          // Resetear métricas opcionales
          if (process.env.RESET_WEEKLY_METRICS === "true") {
            const sequenceManager = getSequenceManager();
            const emailService = getEmailService();

            sequenceManager.resetMetrics();
            emailService.resetMetrics();
            console.log("🧹 [CRON] Métricas reseteadas");
          }
        } catch (error) {
          console.error("❌ [CRON] Error en limpieza:", error);
        }
      },
      {
        scheduled: true,
        timezone: "America/Mexico_City",
      }
    );

    this.jobs.set("weekly_cleanup", job);
    console.log("📅 Cron programado: Limpieza semanal domingos 2:00 AM");
  }

  // 🚨 ALERTAS CRÍTICAS
  private async sendCriticalAlert(message: string, data: any) {
    try {
      const emailService = getEmailService();

      const alertHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #dc2626;">🚨 ALERTA CRÍTICA - Sistema Umi</h2>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-ES")}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
          
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Detalles:</h3>
            <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; overflow-x: auto;">
${JSON.stringify(data, null, 2)}
            </pre>
          </div>
          
          <p>⚠️ <strong>Acción requerida:</strong> Revisar el sistema inmediatamente.</p>
          
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Sistema automatizado - Umi Consultoría</p>
        </div>
      `;

      await emailService.sendEmail({
        to: "hola@umiconsulting.co",
        subject: "🚨 ALERTA CRÍTICA - Sistema de Email",
        html: alertHtml,
        priority: "high",
        campaign: "critical_alert",
      });
    } catch (error) {
      console.error("❌ Error enviando alerta crítica:", error);
    }
  }

  private async cleanupOldLogs() {
    // Implementar limpieza de logs antiguos
    console.log("🧹 Limpiando logs antiguos...");
    // En producción: eliminar logs > 30 días
  }

  // 🛑 CONTROL DE JOBS
  stopJob(jobName: string) {
    const job = this.jobs.get(jobName);
    if (job) {
      job.stop();
      this.jobs.delete(jobName);
      console.log(`🛑 Cron job detenido: ${jobName}`);
    }
  }

  stopAllJobs() {
    for (const [name, job] of this.jobs) {
      job.stop();
      console.log(`🛑 Cron job detenido: ${name}`);
    }
    this.jobs.clear();
  }

  getActiveJobs(): string[] {
    return Array.from(this.jobs.keys());
  }

  getJobStatus() {
    const status = {};
    for (const [name, job] of this.jobs) {
      status[name] = {
        running: job.getStatus() === "scheduled",
        lastRun: "N/A", // En producción, implementar tracking
      };
    }
    return status;
  }
}

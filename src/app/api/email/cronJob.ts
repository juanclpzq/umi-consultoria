// src/lib/email/cronJob.ts - Para configurar tareas programadas
import cron from "node-cron";

export class EmailCronManager {
  private static instance: EmailCronManager;
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  static getInstance(): EmailCronManager {
    if (!EmailCronManager.instance) {
      EmailCronManager.instance = new EmailCronManager();
    }
    return EmailCronManager.instance;
  }

  scheduleSequenceProcessing() {
    const job = cron.schedule(
      "0 9 * * *",
      async () => {
        console.log("⏰ Ejecutando procesamiento diario de secuencias...");

        try {
          const response = await fetch("/api/email-system", { method: "GET" });
          const result = await response.json();

          console.log("✅ Procesamiento completado:", result);
        } catch (error) {
          console.error("❌ Error en cron job:", error);
        }
      },
      {
        scheduled: true,
        timezone: "America/Mexico_City",
      }
    );

    this.jobs.set("daily_sequences", job);
    console.log("📅 Cron job programado: Secuencias diarias a las 9:00 AM");
  }

  scheduleWeeklyReport() {
    const job = cron.schedule(
      "0 10 * * 1",
      async () => {
        console.log("📊 Generando reporte semanal...");

        try {
          const response = await fetch("/api/email-system", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "get_metrics" }),
          });

          const result = await response.json();
          console.log("📈 Métricas semanales:", result.metrics);

          // Enviar reporte semanal detallado
          // implementar según necesidades
        } catch (error) {
          console.error("❌ Error en reporte semanal:", error);
        }
      },
      {
        scheduled: true,
        timezone: "America/Mexico_City",
      }
    );

    this.jobs.set("weekly_report", job);
    console.log(
      "📅 Cron job programado: Reporte semanal los lunes a las 10:00 AM"
    );
  }

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
}

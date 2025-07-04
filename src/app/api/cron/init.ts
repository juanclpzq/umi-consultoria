// 🚀 INICIALIZACIÓN AUTOMÁTICA
// src/lib/cron/init.ts
export const initializeCronJobs = () => {
  if (process.env.ENABLE_CRON_JOBS !== "false") {
    const cronManager = EmailCronManager.getInstance();
    cronManager.initializeAllJobs();

    // Graceful shutdown
    process.on("SIGINT", () => {
      console.log("🛑 Deteniendo cron jobs...");
      cronManager.stopAllJobs();
      process.exit(0);
    });
  } else {
    console.log("⏸️ Cron jobs deshabilitados");
  }
};

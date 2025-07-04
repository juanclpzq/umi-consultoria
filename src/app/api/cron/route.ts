// 📡 API ENDPOINT PARA CONTROL MANUAL
// src/app/api/cron/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const cronManager = EmailCronManager.getInstance();
    const status = cronManager.getJobStatus();
    const activeJobs = cronManager.getActiveJobs();

    return NextResponse.json({
      success: true,
      activeJobs,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo status de cron jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, jobName } = await request.json();
    const cronManager = EmailCronManager.getInstance();

    switch (action) {
      case "start_all":
        cronManager.initializeAllJobs();
        return NextResponse.json({
          success: true,
          message: "Todos los jobs iniciados",
        });

      case "stop_all":
        cronManager.stopAllJobs();
        return NextResponse.json({
          success: true,
          message: "Todos los jobs detenidos",
        });

      case "stop_job":
        if (!jobName) {
          return NextResponse.json(
            { error: "jobName requerido" },
            { status: 400 }
          );
        }
        cronManager.stopJob(jobName);
        return NextResponse.json({
          success: true,
          message: `Job ${jobName} detenido`,
        });

      case "force_sequence":
        // Ejecutar secuencias manualmente
        const sequenceManager = getSequenceManager();
        const results = await sequenceManager.processAllSequences();
        return NextResponse.json({ success: true, results });

      default:
        return NextResponse.json(
          {
            error: "Acción no válida",
            validActions: [
              "start_all",
              "stop_all",
              "stop_job",
              "force_sequence",
            ],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error ejecutando acción de cron" },
      { status: 500 }
    );
  }
}

// src/app/api/cron/email-sequence/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DiagnosticIntegration } from "@/lib/integration/diagnosticTrigger";

export async function POST(request: NextRequest) {
  let diagnosticIntegration: DiagnosticIntegration | null = null;

  try {
    // Verificar autenticación del cron job (opcional)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    diagnosticIntegration = new DiagnosticIntegration();

    console.log("🔄 Iniciando procesamiento de emails programados...");

    // Procesar emails pendientes
    const result = await diagnosticIntegration.processScheduledEmails();

    console.log("✅ Procesamiento completado:", {
      processed: result.processed,
      successful: result.successful,
      failed: result.failed,
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: result,
    });
  } catch (error) {
    console.error("❌ Error en cron job de emails:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error procesando emails programados",
        timestamp: new Date().toISOString(),
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

// GET para verificar estado del cron job
export async function GET() {
  let diagnosticIntegration: DiagnosticIntegration | null = null;

  try {
    diagnosticIntegration = new DiagnosticIntegration();
    const metrics = diagnosticIntegration.getMetrics();

    return NextResponse.json({
      status: "active",
      timestamp: new Date().toISOString(),
      metrics,
    });
  } catch (error) {
    console.error("❌ Error obteniendo estado del cron:", error);

    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (diagnosticIntegration) {
      diagnosticIntegration.close();
    }
  }
}

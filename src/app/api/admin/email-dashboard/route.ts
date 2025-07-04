// src/app/api/admin/email-dashboard/route.ts
// Dashboard administrativo para monitorear el sistema
export async function getEmailDashboard(request: NextRequest) {
  try {
    const sequenceManager = getSequenceManager();
    const emailService = getEmailService();

    const metrics = sequenceManager.getMetrics();
    const emailMetrics = emailService.getMetrics();

    // Combinar métricas de ambos servicios
    const dashboardData = {
      overview: {
        totalLeads: metrics.totalLeads,
        emailsSent: metrics.emailsSent,
        emailsFailed: metrics.emailsFailed,
        responseRate:
          metrics.totalLeads > 0
            ? ((metrics.responsesReceived / metrics.totalLeads) * 100).toFixed(
                1
              ) + "%"
            : "0%",
        conversionRate:
          metrics.totalLeads > 0
            ? ((metrics.conversions / metrics.totalLeads) * 100).toFixed(1) +
              "%"
            : "0%",
      },
      sequences: {
        active: await getActiveSequencesCount(),
        paused: await getPausedSequencesCount(),
        completed: metrics.sequenceCompletions,
      },
      performance: {
        deliveryRate:
          emailMetrics.sent > 0
            ? (
                ((emailMetrics.sent - emailMetrics.failed) /
                  emailMetrics.sent) *
                100
              ).toFixed(1) + "%"
            : "0%",
        avgResponseTime: "4.2 horas", // Calcular dinámicamente
        bestPerformingDay: getDayWithMostResponses(),
      },
      recentActivity: await getRecentActivity(),
    };

    return NextResponse.json({
      success: true,
      dashboard: dashboardData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error obteniendo dashboard:", error);
    return NextResponse.json(
      { error: "Error cargando dashboard" },
      { status: 500 }
    );
  }
}

// Funciones auxiliares para el dashboard
async function getActiveSequencesCount(): Promise<number> {
  // En producción, consultar base de datos
  return 42; // Mock data
}

async function getPausedSequencesCount(): Promise<number> {
  // En producción, consultar base de datos
  return 8; // Mock data
}

function getDayWithMostResponses(): string {
  // Calcular el día de la semana con más respuestas
  return "Martes"; // Mock data
}

async function getRecentActivity(): Promise<any[]> {
  // En producción, obtener actividad reciente de la base de datos
  return [
    {
      type: "email_sent",
      email: "ejemplo@empresa.com",
      subject: "Día 2: Ventana cerrándose",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      type: "lead_responded",
      email: "cliente@pyme.com",
      responseType: "meeting_scheduled",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

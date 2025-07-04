// src/app/api/health/route.ts - Health check del sistema
export async function healthCheck() {
  try {
    const emailService = getEmailService();
    const connectionTest = await emailService.testConnection();

    const health = {
      status: connectionTest ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        emailService: connectionTest ? "up" : "down",
        sequenceManager: "up", // Asumir que siempre está up
      },
      version: "1.0.0",
    };

    return NextResponse.json(health, {
      status: connectionTest ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

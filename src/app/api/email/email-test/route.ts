// src/app/api/email-test/route.ts
export async function testEmailSystem(request: NextRequest) {
  try {
    const { email, type = "connection" } = await request.json();

    const emailService = getEmailService();

    switch (type) {
      case "connection":
        const connectionTest = await emailService.testConnection();
        return NextResponse.json({
          success: connectionTest,
          message: connectionTest ? "Conexión exitosa" : "Error de conexión",
        });

      case "send_test":
        if (!email) {
          return NextResponse.json(
            { error: "Email requerido para test de envío" },
            { status: 400 }
          );
        }

        const sendTest = await emailService.sendTestEmail(email);
        return NextResponse.json({
          success: sendTest,
          message: sendTest
            ? `Email de prueba enviado a ${email}`
            : "Error enviando email de prueba",
        });

      case "sequence_test":
        if (!email) {
          return NextResponse.json(
            { error: "Email requerido para test de secuencia" },
            { status: 400 }
          );
        }

        const sequenceManager = getSequenceManager();
        const sequenceTest = await sequenceManager.testSequence(email);
        return NextResponse.json({
          success: sequenceTest,
          message: sequenceTest
            ? `Secuencia de prueba procesada para ${email}`
            : "Error en test de secuencia",
        });

      default:
        return NextResponse.json(
          {
            error: "Tipo de test no válido",
            validTypes: ["connection", "send_test", "sequence_test"],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("❌ Error en test de email:", error);
    return NextResponse.json(
      { error: "Error ejecutando test" },
      { status: 500 }
    );
  }
}

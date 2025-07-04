/ src/app / api / webhook / email - response / route.ts;
// Webhook para detectar respuestas automáticamente
export async function handleEmailWebhook(request: NextRequest) {
  try {
    const webhookData = await request.json();
    const { type, email, leadId, responseType } = webhookData;

    // Verificar webhook signature para seguridad
    const signature = request.headers.get("x-webhook-signature");
    if (!verifyWebhookSignature(signature, webhookData)) {
      return NextResponse.json(
        { error: "Webhook signature inválida" },
        { status: 401 }
      );
    }

    const sequenceManager = getSequenceManager();

    switch (type) {
      case "email_reply":
        await sequenceManager.markLeadAsResponded(leadId, "email");
        console.log(`✅ Lead ${leadId} respondió por email`);
        break;

      case "meeting_scheduled":
        // Marcar meeting como agendado y pausar secuencia de seguimiento
        await sequenceManager.pauseSequenceForLead(leadId, "meeting_scheduled");
        console.log(`📅 Lead ${leadId} agendó meeting`);
        break;

      case "unsubscribe":
        await sequenceManager.pauseSequenceForLead(leadId, "unsubscribed");
        console.log(`🚫 Lead ${leadId} se desuscribió`);
        break;

      default:
        console.log(`❓ Tipo de webhook desconocido: ${type}`);
    }

    return NextResponse.json({ success: true, processed: type });
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    return NextResponse.json(
      { error: "Error procesando webhook" },
      { status: 500 }
    );
  }
}

function verifyWebhookSignature(signature: string | null, data: any): boolean {
  // Implementar verificación de firma según tu proveedor de webhooks
  // Por ahora, retornar true para testing
  return true;
}

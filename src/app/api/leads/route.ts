// src/app/api/leads/route.ts
export async function manageLeads(request: NextRequest) {
  try {
    const method = request.method;

    if (method === "POST") {
      // Agregar nuevo lead a secuencias
      const leadData = await request.json();

      // Validar datos requeridos
      const requiredFields = ["email", "name", "company", "diagnosticData"];
      const missingFields = requiredFields.filter((field) => !leadData[field]);

      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: `Campos requeridos faltantes: ${missingFields.join(", ")}` },
          { status: 400 }
        );
      }

      // En producción, guardar en base de datos
      console.log("💾 Nuevo lead agregado:", leadData.email);

      // Iniciar secuencia automáticamente si es nuevo diagnóstico
      if (leadData.triggerSequence) {
        const sequenceManager = getSequenceManager();
        // Procesar inmediatamente para este lead específico
        // await sequenceManager.processLeadSequences(leadData);
      }

      return NextResponse.json({
        success: true,
        message: "Lead agregado exitosamente",
        leadId: `lead_${Date.now()}`,
      });
    }

    if (method === "GET") {
      // Obtener estadísticas de leads
      // En producción, consultar base de datos real
      const mockStats = {
        totalLeads: 150,
        activeSequences: 45,
        completedSequences: 89,
        respondedLeads: 23,
        conversionRate: "15.3%",
      };

      return NextResponse.json({
        success: true,
        stats: mockStats,
      });
    }
  } catch (error) {
    console.error("❌ Error gestionando leads:", error);
    return NextResponse.json(
      { error: "Error en gestión de leads" },
      { status: 500 }
    );
  }
}

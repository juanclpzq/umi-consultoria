// src/lib/email/utils.ts - Utilidades compartidas
export class EmailUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static sanitizeSubject(subject: string): string {
    // Remover caracteres que pueden causar problemas
    return subject
      .replace(/[\r\n]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 200); // Límite de longitud
  }

  static generateUnsubscribeLink(leadId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return `${baseUrl}/unsubscribe?lead=${leadId}`;
  }

  static formatMetricsForReport(metrics: any): string {
    return `
Métricas del Sistema de Email:
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Resumen General:
• Leads procesados: ${metrics.totalLeads}
• Emails enviados: ${metrics.emailsSent}
• Emails fallidos: ${metrics.emailsFailed}
• Respuestas recibidas: ${metrics.responsesReceived}

📈 Tasas de Conversión:
• Tasa de entrega: ${metrics.emailsSent > 0 ? (((metrics.emailsSent - metrics.emailsFailed) / metrics.emailsSent) * 100).toFixed(1) : 0}%
• Tasa de respuesta: ${metrics.totalLeads > 0 ? ((metrics.responsesReceived / metrics.totalLeads) * 100).toFixed(1) : 0}%
• Tasa de conversión: ${metrics.totalLeads > 0 ? ((metrics.conversions / metrics.totalLeads) * 100).toFixed(1) : 0}%

⏰ Última actualización: ${new Date().toLocaleString("es-ES")}
    `.trim();
  }

  static createEmailTemplate(
    title: string,
    content: string,
    footer?: string
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Source Sans Pro', Arial, sans-serif; line-height: 1.6; color: #000000; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #223979 0%, #7692CB 100%); color: white; padding: 30px 20px; text-align: center; }
    .content { padding: 30px; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">${title}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      ${footer || "Umi Consultoría - Sistema Automatizado"}
    </div>
  </div>
</body>
</html>
    `;
  }
}

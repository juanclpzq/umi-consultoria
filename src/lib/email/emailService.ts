// Servicio de Email Centralizado
// src/lib/email/emailService.ts

import * as nodemailer from "nodemailer";
import { EmailTemplateData } from "./templates";

export interface EmailConfig {
  from: string;
  replyTo: string;
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  priority?: "high" | "normal" | "low";
  campaign?: string;
  leadId?: string;
  sequenceDay?: number;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export interface EmailMetrics {
  sent: number;
  failed: number;
  bounced?: number;
  opened?: number;
  clicked?: number;
}

// Tipos específicos para mejorar type safety
interface EmailLogData {
  to: string;
  subject: string;
  status: "sent" | "failed";
  messageId?: string;
  error?: string;
  campaign?: string | undefined;
  leadId?: string | undefined;
  sentAt: Date;
}

interface NodemailerInfo {
  messageId: string;
  envelope: {
    from: string;
    to: string[];
  };
  accepted: string[];
  rejected: string[];
  pending: string[];
  response: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;
  private metrics: EmailMetrics = { sent: 0, failed: 0 };

  constructor(config?: Partial<EmailConfig>) {
    this.config = {
      from: '"Ana Sofía - Umi Consultoría" <hola@umiconsulting.co>',
      replyTo: "hola@umiconsulting.co",
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASSWORD || "",
      },
      ...config,
    };

    // Inicializar transporter en el constructor
    this.transporter = this.createTransporter();
  }

  private createTransporter(): nodemailer.Transporter {
    const transporter = nodemailer.createTransport({
      service: this.config.service,
      auth: this.config.auth,
      pool: true, // Para múltiples emails
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000, // 1 segundo entre emails
      rateLimit: 5, // máximo 5 emails por rateDelta
    });

    // Verificar conexión
    transporter.verify((error: Error | null) => {
      if (error) {
        console.error("❌ Error de configuración de email:", error);
      } else {
        console.log("✅ Servidor de email configurado correctamente");
      }
    });

    return transporter;
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.config.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html),
        replyTo: this.config.replyTo,
        attachments: options.attachments,

        // Headers para tracking y deliverability
        headers: {
          "X-Campaign": options.campaign || "general",
          "X-Priority": this.getPriorityValue(options.priority),
          "X-Lead-ID": options.leadId || "unknown",
          "X-Sequence-Day": options.sequenceDay?.toString() || "none",
          "List-Unsubscribe": `<mailto:${this.config.replyTo}?subject=Unsubscribe_${options.leadId}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          "Message-ID": this.generateMessageId(),
        },
      };

      const info = await this.transporter.sendMail(mailOptions);

      this.metrics.sent++;
      this.logEmailSent(options, info);

      return true;
    } catch (error) {
      this.metrics.failed++;
      this.logEmailError(options, error as Error);
      return false;
    }
  }

  async sendBulkEmails(
    emailList: SendEmailOptions[]
  ): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    console.log(`📧 Enviando ${emailList.length} emails en lote...`);

    for (const email of emailList) {
      try {
        const emailSent = await this.sendEmail(email);
        if (emailSent) {
          sent++;
        } else {
          failed++;
        }

        // Delay entre emails para evitar rate limiting
        await this.delay(1000);
      } catch (error) {
        failed++;
        console.error(`❌ Error enviando email a ${email.to}:`, error);
      }
    }

    console.log(`✅ Lote completado: ${sent} enviados, ${failed} fallidos`);
    return { sent, failed };
  }

  async sendWithTemplate(
    templateData: EmailTemplateData,
    templateFunction: (data: EmailTemplateData) => string,
    subject: string,
    options?: Partial<SendEmailOptions>
  ): Promise<boolean> {
    const html = templateFunction(templateData);

    return this.sendEmail({
      to: templateData.contactInfo.email,
      subject: this.personalizeSubject(subject, templateData),
      html,
      campaign: "diagnostic_sequence",
      leadId: `${templateData.contactInfo.email.split("@")[0]}_${Date.now()}`,
      ...options,
    });
  }

  // Métodos de utilidad
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, "") // Remover tags HTML
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();
  }

  private personalizeSubject(subject: string, data: EmailTemplateData): string {
    return subject
      .replace(/\$\{company\}/g, data.contactInfo.company)
      .replace(/\$\{name\}/g, data.contactInfo.name)
      .replace(/\$\{level\}/g, data.diagnosticData.level);
  }

  private getPriorityValue(priority?: "high" | "normal" | "low"): string {
    switch (priority) {
      case "high":
        return "1";
      case "low":
        return "5";
      default:
        return "3";
    }
  }

  private generateMessageId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `<${timestamp}.${random}@umiconsulting.co>`;
  }

  private logEmailSent(options: SendEmailOptions, info: NodemailerInfo) {
    console.log(`✅ Email enviado: ${options.to} - ${options.subject}`);
    console.log(`📬 Message ID: ${info.messageId}`);

    // En producción, guardar en base de datos
    this.saveEmailLog({
      to: options.to,
      subject: options.subject,
      status: "sent",
      messageId: info.messageId,
      campaign: options.campaign || undefined,
      leadId: options.leadId || undefined,
      sentAt: new Date(),
    });
  }

  private logEmailError(options: SendEmailOptions, error: Error) {
    console.error(`❌ Error enviando email: ${options.to} - ${error.message}`);

    // En producción, guardar en base de datos
    this.saveEmailLog({
      to: options.to,
      subject: options.subject,
      status: "failed",
      error: error.message,
      campaign: options.campaign || undefined,
      leadId: options.leadId || undefined,
      sentAt: new Date(),
    });
  }

  private async saveEmailLog(logData: EmailLogData) {
    // En producción, implementar guardado en base de datos
    // Por ahora, solo console.log para debugging
    console.log("📊 Email log:", JSON.stringify(logData, null, 2));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Métodos de métricas y monitoreo
  getMetrics(): EmailMetrics {
    return { ...this.metrics };
  }

  resetMetrics() {
    this.metrics = { sent: 0, failed: 0 };
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("✅ Conexión de email verificada exitosamente");
      return true;
    } catch (error) {
      console.error("❌ Error verificando conexión de email:", error);
      return false;
    }
  }

  async sendTestEmail(toEmail: string): Promise<boolean> {
    const testData: EmailTemplateData = {
      contactInfo: {
        name: "Usuario de Prueba",
        email: toEmail,
        company: "Empresa Test",
      },
      diagnosticData: {
        score: 5,
        level: "Intermedio",
        primaryChallenge: "Organización de datos",
        quickWins: [
          {
            action: "Dashboard básico",
            description: "Implementar KPIs principales",
          },
        ],
        estimatedROI: {
          timeToValue: 30,
          expectedReturn: 200,
        },
      },
    };

    return this.sendEmail({
      to: toEmail,
      subject: "🧪 Email de Prueba - Sistema Umi",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #223979;">✅ Test Email - Sistema Funcionando</h2>
          <p>Hola <strong>${testData.contactInfo.name}</strong>,</p>
          <p>Este es un email de prueba del sistema de Umi Consultoría.</p>
          <p><strong>Datos de prueba:</strong></p>
          <ul>
            <li>Nivel: ${testData.diagnosticData.level}</li>
            <li>Score: ${testData.diagnosticData.score}/10</li>
            <li>ROI Estimado: ${testData.diagnosticData.estimatedROI.expectedReturn}%</li>
          </ul>
          <p>Si recibes este email, el sistema está configurado correctamente.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">Umi Consultoría - Sistema de Email Automatizado</p>
        </div>
      `,
      campaign: "test",
      priority: "normal",
    });
  }

  // Método para cerrar conexiones al finalizar
  close() {
    if (this.transporter) {
      this.transporter.close();
      console.log("📤 Conexiones de email cerradas");
    }
  }
}

// Instancia singleton para usar en toda la aplicación
let emailServiceInstance: EmailService | null = null;

export const getEmailService = (
  config?: Partial<EmailConfig>
): EmailService => {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService(config);
  }
  return emailServiceInstance;
};

// Para usar en Next.js API routes
export const createEmailService = (
  config?: Partial<EmailConfig>
): EmailService => {
  return new EmailService(config);
};

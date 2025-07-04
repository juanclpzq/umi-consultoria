import { NextRequest, NextResponse } from "next/server";
import * as nodemailer from "nodemailer";

// Tipos para el formulario de contacto
interface ContactFormData {
  name: string;
  email: string;
  company: string;
  need: string;
  message: string;
}

// Configuración del transportador de correo
const createTransporter = () => {
  // Usando Gmail/Google Workspace (recomendado para profesionales)
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // hola@umiconsulting.co
      pass: process.env.EMAIL_PASSWORD, // App Password de Google
    },
  });

  // Alternativa con SMTP personalizado (si tienes servidor propio):
  // return nodemailer.createTransporter({
  //   host: process.env.SMTP_HOST,
  //   port: parseInt(process.env.SMTP_PORT || '587'),
  //   secure: false,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });
};

// Función para generar el template del correo para Umi
const generateUmiEmailTemplate = (data: ContactFormData): string => {
  const needTranslations: Record<string, string> = {
    emprendedor: "Emprendedor buscando estructurar datos",
    pyme: "PyME con múltiples proyectos",
    directivo: "Directivo que necesita decisiones basadas en datos",
    otro: "Otra necesidad",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Source Sans Pro', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #223979; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .logo { font-family: 'Domus', Arial, sans-serif; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .section { margin-bottom: 25px; }
        .label { font-weight: 600; color: #223979; margin-bottom: 5px; display: block; }
        .value { background: #f9fafb; padding: 12px; border-radius: 6px; border-left: 3px solid #7692CB; }
        .priority-high { border-left-color: #ef4444; }
        .priority-medium { border-left-color: #f59e0b; }
        .priority-low { border-left-color: #10b981; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
        .cta-button { background: #223979; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #223979; }
        .stat-label { font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">umi</div>
          <p>Nueva consulta recibida</p>
        </div>
        
        <div class="content">
          <div class="section">
            <span class="label">Cliente Potencial:</span>
            <div class="value priority-high">
              <strong>${data.name}</strong><br>
              📧 ${data.email}<br>
              🏢 ${data.company || "No especificada"}
            </div>
          </div>

          <div class="section">
            <span class="label">Tipo de Necesidad:</span>
            <div class="value priority-medium">
              ${needTranslations[data.need] || data.need}
            </div>
          </div>

          <div class="section">
            <span class="label">Mensaje:</span>
            <div class="value">
              ${data.message || "Sin mensaje adicional"}
            </div>
          </div>

          <div class="stats">
            <div class="stat">
              <div class="stat-number">⏱️</div>
              <div class="stat-label">Responder en 2h</div>
            </div>
            <div class="stat">
              <div class="stat-number">📊</div>
              <div class="stat-label">Oportunidad BI</div>
            </div>
            <div class="stat">
              <div class="stat-number">🎯</div>
              <div class="stat-label">Lead cualificado</div>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="mailto:${data.email}" class="cta-button">
              Responder Directamente
            </a>
          </div>
        </div>

        <div class="footer">
          <p><strong>Umi Consultoría</strong> - Análisis de datos e inteligencia de negocio</p>
          <p>Recibido: ${new Date().toLocaleString("es-ES", {
            timeZone: "America/Mexico_City",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Función para generar respuesta automática al cliente
const generateClientAutoReply = (data: ContactFormData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Source Sans Pro', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #223979; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .logo { font-family: 'Domus', Arial, sans-serif; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
        .cta-button { background: #7692CB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0; }
        .highlight { background: #f0f4ff; padding: 15px; border-radius: 6px; border-left: 3px solid #7692CB; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">umi</div>
          <p>¡Gracias por contactarnos!</p>
        </div>
        
        <div class="content">
          <p>Hola <strong>${data.name}</strong>,</p>
          
          <p>Hemos recibido tu consulta y queremos agradecerte por considerar a Umi para tus necesidades de análisis de datos y business intelligence.</p>

          <div class="highlight">
            <strong>¿Qué sigue ahora?</strong><br>
            • Revisaremos tu solicitud en las próximas 2 horas<br>
            • Te contactaremos para agendar una consulta inicial gratuita<br>
            • Prepararemos una propuesta personalizada según tus necesidades
          </div>

          <p>Mientras tanto, te invitamos a:</p>
          <ul>
            <li>Revisar nuestros <a href="https://umiconsultoria.com/casos-exito">casos de éxito</a></li>
            <li>Completar nuestro <a href="https://umiconsultoria.com/diagnostico">diagnóstico gratuito</a> si aún no lo has hecho</li>
            <li>Seguirnos en nuestras redes sociales para tips de análisis de datos</li>
          </ul>

          <div style="text-align: center;">
            <a href="https://umiconsultoria.com/diagnostico" class="cta-button">
              Realizar Diagnóstico Gratuito
            </a>
          </div>

          <p>¡Esperamos poder ayudarte a transformar tus datos en decisiones estratégicas!</p>
          
          <p>Saludos cordiales,<br>
          <strong>Equipo Umi Consultoría</strong></p>
        </div>

        <div class="footer">
          <p><strong>Umi Consultoría</strong></p>
          <p>📧 hola@umiconsulting.co | 📱 +52 667 730 1913</p>
          <p>Análisis de datos e inteligencia de negocio</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    // Validación básica
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: "Nombre y email son requeridos" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    const transporter = createTransporter();

    // Email para Umi (notificación interna)
    const umiMailOptions = {
      from: `"Umi Consultoría" <${process.env.EMAIL_USER}>`,
      to: "hola@umiconsulting.co",
      subject: `🚀 Nueva consulta de ${data.name} - ${data.company || "Cliente potencial"}`,
      html: generateUmiEmailTemplate(data),
      // También incluir versión texto plano para mejor deliverability
      text: `
        Nueva consulta recibida:
        
        Cliente: ${data.name}
        Email: ${data.email}
        Empresa: ${data.company || "No especificada"}
        Necesidad: ${data.need}
        Mensaje: ${data.message || "Sin mensaje adicional"}
        
        Fecha: ${new Date().toLocaleString("es-ES")}
      `,
    };

    // Email de respuesta automática al cliente
    const clientMailOptions = {
      from: `"Umi Consultoría" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "✅ Hemos recibido tu consulta - Umi Consultoría",
      html: generateClientAutoReply(data),
      text: `
        Hola ${data.name},
        
        Hemos recibido tu consulta y te contactaremos pronto.
        
        Mientras tanto, puedes revisar nuestros recursos gratuitos en:
        https://umiconsultoria.com/diagnostico
        
        Saludos,
        Equipo Umi Consultoría
      `,
    };

    // Enviar ambos emails
    await Promise.all([
      transporter.sendMail(umiMailOptions),
      transporter.sendMail(clientMailOptions),
    ]);

    // Log para debugging (remover en producción)
    console.log("Emails enviados exitosamente:", {
      cliente: data.email,
      empresa: data.company,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Consulta enviada exitosamente",
    });
  } catch (error) {
    console.error("Error al enviar email:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

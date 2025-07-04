// Email Templates Modulares
// src/lib/email/templates.ts

export interface EmailTemplateData {
  contactInfo: {
    name: string;
    email: string;
    company: string;
  };
  diagnosticData: {
    score: number;
    level: string;
    primaryChallenge: string;
    quickWins: Array<{ action: string; description: string }>;
    estimatedROI: {
      timeToValue: number;
      expectedReturn: number;
    };
  };
}

// Base template con estructura común
export const createBaseTemplate = (content: string, title: string = "") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Source Sans Pro', Arial, sans-serif; line-height: 1.6; color: #000000; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #223979 0%, #7692CB 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
    .logo { font-family: 'Domus', Arial, sans-serif; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
    .header-title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
    .content { padding: 30px; }
    .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 12px 12px; }
    .cta-button { background: #223979; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 15px 0; font-weight: 600; }
    .urgent-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .success-box { background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .info-box { background: #f0f4ff; border: 1px solid #7692CB; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .warning-box { background: #fef2f2; border: 1px solid #ef4444; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">umi</div>
      ${title ? `<div class="header-title">${title}</div>` : ""}
    </div>
    
    <div class="content">
      ${content}
    </div>

    <div class="footer">
      <p><strong>Umi Consultoría</strong></p>
      <p>📧 hola@umiconsulting.co | 📱 +52 667 730 1913</p>
      <p>Especialistas en análisis de datos para PyMEs</p>
    </div>
  </div>
</body>
</html>
`;

// Template Day 0: Urgencia inmediata
export const day0UrgencyTemplate = (data: EmailTemplateData): string => {
  const content = `
    <p>Hola <strong>${data.contactInfo.name}</strong>,</p>
    
    <p>Acabas de completar tu diagnóstico y los resultados muestran una <strong>oportunidad inmediata</strong> para ${data.contactInfo.company}.</p>

    <div class="urgent-box">
      <h4 style="margin-top: 0; color: #92400e;">🚨 Ventana de Oportunidad: ${data.diagnosticData.estimatedROI.timeToValue} días</h4>
      <p><strong>Tu nivel ${data.diagnosticData.level}</strong> indica que puedes implementar cambios con impacto inmediato. Empresas similares que actúan rápido ven resultados en ${data.diagnosticData.estimatedROI.timeToValue} días vs 3-6 meses cuando esperan.</p>
    </div>

    <h4>🎯 Lo que está en juego para ${data.contactInfo.company}:</h4>
    <ul>
      <li><strong>ROI potencial:</strong> ${data.diagnosticData.estimatedROI.expectedReturn}% en los próximos 6 meses</li>
      <li><strong>Quick wins:</strong> ${data.diagnosticData.quickWins.length} acciones de impacto inmediato identificadas</li>
      <li><strong>Ventaja competitiva:</strong> ${data.diagnosticData.primaryChallenge} resuelto antes que tu competencia</li>
    </ul>

    <div class="success-box">
      <h4 style="margin-top: 0; color: #065f46;">✅ Próximas 48 horas = Críticas</h4>
      <p>He bloqueado tiempo específico para ${data.contactInfo.company} en mi agenda. Podemos agendar 30 minutos esta semana para diseñar tu hoja de ruta específica.</p>
    </div>

    <div style="text-align: center;">
      <a href="https://calendly.com/umi-consultoria/estrategia-${data.diagnosticData.level.toLowerCase()}" class="cta-button">
        📅 Agendar mi estrategia (30 min)
      </a>
    </div>

    <p><strong>Garantía:</strong> Si no identificamos al menos 3 mejoras específicas para ${data.contactInfo.company}, la consulta es gratuita.</p>
    
    <p>Saludos,<br>
    <strong>Ana Sofía Martínez</strong><br>
    Fundadora, Umi Consultoría</p>

    <p style="font-size: 12px; color: #6b7280;">PD: Respondes a este email y me llega directamente. Si tienes dudas específicas sobre tu diagnóstico, con gusto las resuelvo.</p>
  `;

  return createBaseTemplate(content, "⚡ ¡Momento clave para tu empresa!");
};

// Template Day 2: Presión social
export const day2PressureTemplate = (data: EmailTemplateData): string => {
  const content = `
    <p>Hola ${data.contactInfo.name},</p>
    
    <p>Hace 2 días completaste tu diagnóstico que mostró <strong>nivel ${data.diagnosticData.level}</strong> para ${data.contactInfo.company}.</p>

    <p><strong>¿Por qué te escribo de nuevo?</strong></p>
    
    <p>Porque los datos no mienten: empresas que implementan en las primeras 72 horas ven <strong>3x mejores resultados</strong> que las que esperan semanas.</p>

    <div class="warning-box">
      <p><strong>⚠️ Riesgo real:</strong> Tu principal desafío "${data.diagnosticData.primaryChallenge}" empeora cada día sin acción. He visto empresas perder 20-30% eficiencia por esperar "el momento perfecto".</p>
    </div>

    <p><strong>Solución simple:</strong> 30 minutos conmigo = Plan específico para ${data.contactInfo.company}</p>

    <p><strong>Agenda aquí:</strong> <a href="https://calendly.com/umi-consultoria/urgente-${data.diagnosticData.level.toLowerCase()}" style="color: #223979; font-weight: bold;">calendly.com/umi-consultoria/urgente</a></p>

    <p>O responde este email con <strong>"SÍ"</strong> y yo te llamo hoy.</p>

    <p>Ana Sofía</p>
  `;

  return createBaseTemplate(content, "⏰ Ventana cerrándose");
};

// Template Day 5: Caso de éxito
export const day5CaseStudyTemplate = (data: EmailTemplateData): string => {
  const content = `
    <p>Hola ${data.contactInfo.name},</p>
    
    <p>Te comparto un caso que te va a resonar:</p>

    <div class="info-box">
      <h4 style="margin-top: 0;">📈 Constructora MCH (PyME, 15 empleados)</h4>
      <p><strong>Antes:</strong> Nivel ${data.diagnosticData.level} (igual que ${data.contactInfo.company})<br>
      <strong>Desafío:</strong> ${data.diagnosticData.primaryChallenge}<br>
      <strong>Resultado:</strong> 24% aumento en eficiencia operativa en 90 días</p>
    </div>

    <p><strong>¿Qué hicieron diferente?</strong></p>
    <ol>
      <li>Implementaron las 3 quick wins que identificamos (similares a las tuyas)</li>
      <li>Siguieron el plan de ${data.diagnosticData.estimatedROI.timeToValue} días</li>
      <li>Midieron resultados semanalmente</li>
    </ol>

    <p><strong>¿El factor clave?</strong> Empezaron inmediatamente después del diagnóstico.</p>

    <p>Tu ventana sigue abierta. ¿Hablamos esta semana?</p>

    <div style="text-align: center;">
      <a href="https://calendly.com/umi-consultoria/caso-exito" class="cta-button">Agendar 30 min</a>
    </div>

    <p>Saludos,<br>Ana Sofía</p>
  `;

  return createBaseTemplate(content, "📊 Caso real: Empresa como la tuya");
};

// Template Day 10: Oferta gratuita
export const day10FreeOfferTemplate = (data: EmailTemplateData): string => {
  const content = `
    <p>Hola ${data.contactInfo.name},</p>
    
    <p>Han pasado 10 días desde tu diagnóstico de ${data.contactInfo.company}.</p>

    <p><strong>Entiendo.</strong> Las PyMEs tienen mil prioridades y tomar decisiones sobre datos puede parecer "una más en la lista".</p>

    <p>Pero aquí está la realidad:</p>

    <div class="urgent-box">
      <h4 style="color: #92400e; margin-top: 0;">🎯 Oferta por tiempo limitado (solo esta semana)</h4>
      <p><strong>Te implemento GRATIS la primera quick win</strong> de tu diagnóstico.</p>
      <p>Valor: $2,500 MXN → $0</p>
      <p>Tiempo: 1 semana</p>
      <p>Compromiso de tu parte: 0</p>
    </div>

    <p><strong>¿Por qué gratis?</strong> Porque necesito un caso de éxito más en mi industria, y ${data.contactInfo.company} con nivel ${data.diagnosticData.level} es candidato perfecto.</p>

    <p><strong>¿Qué quick win implementaríamos?</strong><br>
    ${data.diagnosticData.quickWins[0]?.action || "Dashboard básico de KPIs principales"} - algo que verás funcionando en 7 días.</p>

    <p>Solo tengo 3 slots disponibles este mes para implementaciones gratuitas.</p>

    <p><strong>¿Te interesa?</strong> Responde "QUIERO" y coordinamos.</p>

    <p>Si no es para ti, no hay problema. Te enviaré recursos útiles de vez en cuando.</p>

    <p>Ana Sofía<br>
    PD: Esta es mi última propuesta activa. Después solo contenido educativo ocasional.</p>
  `;

  return createBaseTemplate(
    content,
    "🎁 Última oportunidad: Implementación gratuita"
  );
};

// Template Day 30: Reactivación
export const day30ReactivationTemplate = (data: EmailTemplateData): string => {
  const content = `
    <p>Hola ${data.contactInfo.name},</p>
    
    <p>Ha pasado un mes desde tu diagnóstico. Espero que ${data.contactInfo.company} esté creciendo.</p>

    <p><strong>¿Por qué te escribo?</strong> Nuevas tendencias que pueden interesarte:</p>

    <ul>
      <li>🤖 IA generativa aplicada a análisis de datos (reducción 70% tiempo de reportes)</li>
      <li>📱 Dashboards móviles para PyMEs (decisiones en tiempo real)</li>
      <li>💰 ROI promedio 2024: 340% para empresas nivel ${data.diagnosticData.level}</li>
    </ul>

    <div class="info-box">
      <h4 style="margin-top: 0;">📚 Recursos que te pueden servir ahora:</h4>
      <ul style="margin: 10px 0;">
        <li><a href="#" style="color: #223979;">Template gratuito: Dashboard básico para ${data.diagnosticData.primaryChallenge}</a></li>
        <li><a href="#" style="color: #223979;">Checklist: 10 KPIs esenciales para PyMEs</a></li>
        <li><a href="#" style="color: #223979;">Caso de estudio: Implementación en 15 días</a></li>
      </ul>
    </div>

    <p>Si en algún momento necesitas apoyo con datos, sabes dónde encontrarme.</p>

    <p>Éxito para ${data.contactInfo.company}!</p>

    <p>Ana Sofía</p>
  `;

  return createBaseTemplate(
    content,
    "📈 Actualización del mercado: Nuevas tendencias BI"
  );
};

// Template para No-show
export const noShowTemplate = (data: EmailTemplateData): string => {
  const content = `
    <p>Hola ${data.contactInfo.name},</p>
    
    <p>Te esperé hoy para nuestra consulta sobre ${data.contactInfo.company}.</p>

    <p>Entiendo - las cosas pasan. Las PyMEs tienen emergencias constantes.</p>

    <p><strong>¿Reagendamos?</strong> Tu diagnóstico sigue válido y las oportunidades identificadas siguen ahí.</p>

    <p>Responde con tu disponibilidad esta semana o agenda directamente:</p>

    <div style="text-align: center;">
      <a href="https://calendly.com/umi-consultoria/reagendar" class="cta-button">Reagendar consulta</a>
    </div>

    <p>Si cambió tu prioridad, avísame. Sin problemas.</p>

    <p>Ana Sofía</p>
  `;

  return createBaseTemplate(content, "❓ ¿Todo bien? Reagendemos tu consulta");
};

// Exportar todas las templates organizadas
export const EmailTemplates = {
  day0Urgency: day0UrgencyTemplate,
  day2Pressure: day2PressureTemplate,
  day5CaseStudy: day5CaseStudyTemplate,
  day10FreeOffer: day10FreeOfferTemplate,
  day30Reactivation: day30ReactivationTemplate,
  noShow: noShowTemplate,
};

// Función helper para obtener template por día
export const getTemplateByDay = (
  day: number,
  trigger: string = "no_response"
) => {
  if (trigger === "no_response") {
    switch (day) {
      case 0:
        return EmailTemplates.day0Urgency;
      case 2:
        return EmailTemplates.day2Pressure;
      case 5:
        return EmailTemplates.day5CaseStudy;
      case 10:
        return EmailTemplates.day10FreeOffer;
      case 30:
        return EmailTemplates.day30Reactivation;
      default:
        return null;
    }
  } else if (trigger === "no_show") {
    return EmailTemplates.noShow;
  }

  return null;
};

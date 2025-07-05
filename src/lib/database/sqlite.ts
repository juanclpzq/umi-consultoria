// src/lib/database/sqlite.ts
import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export interface LeadData {
  id: string;
  email: string;
  name: string;
  company?: string;
  diagnosticDate: string;
  lastEmailSent?: string;
  emailsSent: string[]; // Array of email template names
  sequencePaused: boolean;
  pauseReason?: string;
  diagnosticData: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmailLog {
  id?: number;
  leadId: string;
  templateName: string;
  sequenceDay: number;
  sentAt?: string;
  subject?: string;
  status: "sent" | "failed" | "pending";
}

export interface LeadMetrics {
  totalLeads: number;
  emailsSentToday: number;
  emailsSentThisWeek: number;
  emailsSentThisMonth: number;
  activeSequences: number;
  pausedSequences: number;
  conversionRate: number;
}

export class LeadDatabase {
  private db: Database.Database;
  private dbPath: string;

  constructor() {
    // Crear directorio data si no existe
    const dataDir = path.join(process.cwd(), "data");
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    this.dbPath = process.env.DATABASE_PATH || path.join(dataDir, "leads.db");
    this.db = new Database(this.dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    try {
      // Crear tabla de leads
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS leads (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          company TEXT,
          diagnosticDate TEXT NOT NULL,
          lastEmailSent TEXT,
          emailsSent TEXT DEFAULT '[]',
          sequencePaused BOOLEAN DEFAULT 0,
          pauseReason TEXT,
          diagnosticData TEXT NOT NULL,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
          updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Crear tabla de logs de emails
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS email_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          leadId TEXT NOT NULL,
          templateName TEXT NOT NULL,
          sequenceDay INTEGER NOT NULL,
          sentAt TEXT DEFAULT CURRENT_TIMESTAMP,
          subject TEXT,
          status TEXT DEFAULT 'sent',
          FOREIGN KEY (leadId) REFERENCES leads (id)
        )
      `);

      // Crear índices para optimizar consultas
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
        CREATE INDEX IF NOT EXISTS idx_leads_diagnostic_date ON leads(diagnosticDate);
        CREATE INDEX IF NOT EXISTS idx_email_logs_lead_id ON email_logs(leadId);
        CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sentAt);
      `);

      console.log("✅ Base de datos SQLite inicializada correctamente");
    } catch (error) {
      console.error("❌ Error inicializando base de datos:", error);
      throw error;
    }
  }

  /**
   * Buscar lead por email
   */
  findLeadByEmail(email: string): LeadData | null {
    try {
      const stmt = this.db.prepare("SELECT * FROM leads WHERE email = ?");
      const row = stmt.get(email) as any;

      if (!row) return null;

      return {
        ...row,
        emailsSent: JSON.parse(row.emailsSent || "[]"),
        diagnosticData: JSON.parse(row.diagnosticData || "{}"),
        sequencePaused: Boolean(row.sequencePaused),
      };
    } catch (error) {
      console.error("❌ Error buscando lead por email:", error);
      return null;
    }
  }

  /**
   * Crear o actualizar lead
   */
  upsertLead(leadData: LeadData): LeadData {
    try {
      const existingLead = this.findLeadByEmail(leadData.email);

      if (existingLead) {
        // Actualizar lead existente
        const stmt = this.db.prepare(`
          UPDATE leads 
          SET name = ?, company = ?, diagnosticDate = ?, diagnosticData = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE email = ?
        `);

        stmt.run(
          leadData.name,
          leadData.company || null,
          leadData.diagnosticDate,
          JSON.stringify(leadData.diagnosticData),
          leadData.email
        );

        return this.findLeadByEmail(leadData.email)!;
      } else {
        // Crear nuevo lead
        const stmt = this.db.prepare(`
          INSERT INTO leads (id, email, name, company, diagnosticDate, emailsSent, sequencePaused, diagnosticData)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
          leadData.id,
          leadData.email,
          leadData.name,
          leadData.company || null,
          leadData.diagnosticDate,
          JSON.stringify(leadData.emailsSent || []),
          leadData.sequencePaused ? 1 : 0,
          JSON.stringify(leadData.diagnosticData)
        );

        return this.findLeadByEmail(leadData.email)!;
      }
    } catch (error) {
      console.error("❌ Error creando/actualizando lead:", error);
      throw error;
    }
  }

  /**
   * Verificar si un email específico fue enviado
   */
  wasEmailSent(leadId: string, sequenceDay: number): boolean {
    try {
      const stmt = this.db.prepare(`
        SELECT COUNT(*) as count 
        FROM email_logs 
        WHERE leadId = ? AND sequenceDay = ? AND status = 'sent'
      `);

      const result = stmt.get(leadId, sequenceDay) as { count: number };
      return result.count > 0;
    } catch (error) {
      console.error("❌ Error verificando email enviado:", error);
      return false;
    }
  }

  /**
   * Calcular días transcurridos desde el diagnóstico
   */
  getDaysElapsed(leadId: string): number {
    try {
      const stmt = this.db.prepare(
        "SELECT diagnosticDate FROM leads WHERE id = ?"
      );
      const row = stmt.get(leadId) as { diagnosticDate: string };

      if (!row) return 0;

      const diagnosticDate = new Date(row.diagnosticDate);
      const today = new Date();
      const diffTime = today.getTime() - diagnosticDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return Math.max(0, diffDays);
    } catch (error) {
      console.error("❌ Error calculando días transcurridos:", error);
      return 0;
    }
  }

  /**
   * Registrar email enviado
   */
  logEmailSent(emailLog: EmailLog): void {
    try {
      const transaction = this.db.transaction(() => {
        // Insertar log de email
        const logStmt = this.db.prepare(`
          INSERT INTO email_logs (leadId, templateName, sequenceDay, subject, status)
          VALUES (?, ?, ?, ?, ?)
        `);

        logStmt.run(
          emailLog.leadId,
          emailLog.templateName,
          emailLog.sequenceDay,
          emailLog.subject || null,
          emailLog.status
        );

        // Actualizar lead con último email enviado
        const updateStmt = this.db.prepare(`
          UPDATE leads 
          SET lastEmailSent = CURRENT_TIMESTAMP, 
              emailsSent = json_insert(emailsSent, '$[#]', ?),
              updatedAt = CURRENT_TIMESTAMP
          WHERE id = ?
        `);

        updateStmt.run(emailLog.templateName, emailLog.leadId);
      });

      transaction();
    } catch (error) {
      console.error("❌ Error registrando email enviado:", error);
      throw error;
    }
  }

  /**
   * Obtener leads pendientes de emails según días transcurridos
   */
  getLeadsPendingEmails(): Array<LeadData & { daysElapsed: number }> {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM leads 
        WHERE sequencePaused = 0
        ORDER BY diagnosticDate ASC
      `);

      const leads = stmt.all() as any[];
      const leadsWithDays = leads.map((lead) => {
        const daysElapsed = this.getDaysElapsed(lead.id);
        return {
          ...lead,
          emailsSent: JSON.parse(lead.emailsSent || "[]"),
          diagnosticData: JSON.parse(lead.diagnosticData || "{}"),
          sequencePaused: Boolean(lead.sequencePaused),
          daysElapsed,
        };
      });

      // Filtrar leads que necesitan emails
      return leadsWithDays.filter((lead) => {
        const { daysElapsed } = lead;
        const sequenceDays = [0, 2, 5, 10, 30];

        return sequenceDays.some((day) => {
          return daysElapsed >= day && !this.wasEmailSent(lead.id, day);
        });
      });
    } catch (error) {
      console.error("❌ Error obteniendo leads pendientes:", error);
      return [];
    }
  }

  /**
   * Obtener métricas del sistema
   */
  getMetrics(): LeadMetrics {
    try {
      const totalLeadsStmt = this.db.prepare(
        "SELECT COUNT(*) as count FROM leads"
      );
      const totalLeads = (totalLeadsStmt.get() as { count: number }).count;

      const emailsTodayStmt = this.db.prepare(`
        SELECT COUNT(*) as count FROM email_logs 
        WHERE DATE(sentAt) = DATE('now')
      `);
      const emailsSentToday = (emailsTodayStmt.get() as { count: number })
        .count;

      const emailsWeekStmt = this.db.prepare(`
        SELECT COUNT(*) as count FROM email_logs 
        WHERE sentAt >= DATE('now', '-7 days')
      `);
      const emailsSentThisWeek = (emailsWeekStmt.get() as { count: number })
        .count;

      const emailsMonthStmt = this.db.prepare(`
        SELECT COUNT(*) as count FROM email_logs 
        WHERE sentAt >= DATE('now', '-30 days')
      `);
      const emailsSentThisMonth = (emailsMonthStmt.get() as { count: number })
        .count;

      const activeSequencesStmt = this.db.prepare(`
        SELECT COUNT(*) as count FROM leads WHERE sequencePaused = 0
      `);
      const activeSequences = (activeSequencesStmt.get() as { count: number })
        .count;

      const pausedSequencesStmt = this.db.prepare(`
        SELECT COUNT(*) as count FROM leads WHERE sequencePaused = 1
      `);
      const pausedSequences = (pausedSequencesStmt.get() as { count: number })
        .count;

      return {
        totalLeads,
        emailsSentToday,
        emailsSentThisWeek,
        emailsSentThisMonth,
        activeSequences,
        pausedSequences,
        conversionRate: 0, // Implementar lógica de conversión en el futuro
      };
    } catch (error) {
      console.error("❌ Error obteniendo métricas:", error);
      return {
        totalLeads: 0,
        emailsSentToday: 0,
        emailsSentThisWeek: 0,
        emailsSentThisMonth: 0,
        activeSequences: 0,
        pausedSequences: 0,
        conversionRate: 0,
      };
    }
  }

  /**
   * Pausar secuencia de un lead
   */
  pauseSequence(leadId: string, reason?: string): void {
    try {
      const stmt = this.db.prepare(`
        UPDATE leads 
        SET sequencePaused = 1, pauseReason = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(reason || "Pausado manualmente", leadId);
    } catch (error) {
      console.error("❌ Error pausando secuencia:", error);
      throw error;
    }
  }

  /**
   * Reanudar secuencia de un lead
   */
  resumeSequence(leadId: string): void {
    try {
      const stmt = this.db.prepare(`
        UPDATE leads 
        SET sequencePaused = 0, pauseReason = NULL, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(leadId);
    } catch (error) {
      console.error("❌ Error reanudando secuencia:", error);
      throw error;
    }
  }

  /**
   * Cerrar conexión a la base de datos
   */
  close(): void {
    try {
      this.db.close();
      console.log("✅ Conexión a base de datos cerrada");
    } catch (error) {
      console.error("❌ Error cerrando base de datos:", error);
    }
  }

  /**
   * Obtener todos los logs de un lead
   */
  getLeadEmailLogs(leadId: string): EmailLog[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM email_logs 
        WHERE leadId = ? 
        ORDER BY sentAt DESC
      `);

      return stmt.all(leadId) as EmailLog[];
    } catch (error) {
      console.error("❌ Error obteniendo logs del lead:", error);
      return [];
    }
  }
}

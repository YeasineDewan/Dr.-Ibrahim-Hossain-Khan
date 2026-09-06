export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  outcome: 'success' | 'failure' | 'denied';
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

type AuditHandler = (entry: AuditEntry) => void;

class AuditLogger {
  private handlers: AuditHandler[] = [];
  private buffer: AuditEntry[] = [];
  private maxBufferSize = 100;

  on(handler: AuditHandler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  log(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
    const auditEntry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...entry,
    };

    this.buffer.push(auditEntry);
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }

    for (const handler of this.handlers) {
      try {
        handler(auditEntry);
      } catch {
        // ignore handler errors
      }
    }
  }

  logAuth(userId: string, action: string, outcome: AuditEntry['outcome'], ip?: string, userAgent?: string) {
    this.log({
      userId,
      action,
      resource: 'auth',
      outcome,
      ip,
      userAgent,
    });
  }

  logPermission(userId: string, resource: string, action: string, outcome: AuditEntry['outcome']) {
    this.log({
      userId,
      action,
      resource,
      outcome,
    });
  }

  logDataChange(userId: string, resource: string, action: string, details?: Record<string, any>) {
    this.log({
      userId,
      action,
      resource,
      outcome: 'success',
      details,
    });
  }

  private flush() {
    if (this.buffer.length === 0) return;
    const entries = [...this.buffer];
    this.buffer = [];
    console.log('[Audit] Flushing entries:', entries.length);
  }
}

export const audit = new AuditLogger();

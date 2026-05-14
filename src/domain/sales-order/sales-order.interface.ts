import { AuditableRecord } from '../common/auditable-record.interface';

export interface SalesOrder extends AuditableRecord {
  customerId?: number | null;
  agentId?: number | null;
  year?: number | null;
  month?: number | null;
  total?: number | null;
}

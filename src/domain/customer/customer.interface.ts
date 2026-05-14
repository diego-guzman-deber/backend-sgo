import { AuditableRecord } from '../common/auditable-record.interface';

export interface Customer extends AuditableRecord {
  name: string;
  phone?: string | null;
  email?: string | null;
}

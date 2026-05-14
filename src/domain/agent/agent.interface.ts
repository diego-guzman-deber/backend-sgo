import { AuditableRecord } from '../common/auditable-record.interface';

export interface Agent extends AuditableRecord {
  name: string;
}

import { AuditableRecord } from '../common/auditable-record.interface';

export interface MediaChannel extends AuditableRecord {
  name: string;
}

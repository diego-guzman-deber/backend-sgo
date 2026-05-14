import { AuditableRecord } from '../common/auditable-record.interface';

export interface Product extends AuditableRecord {
  name: string;
  mediaChannelId?: number | null;
}

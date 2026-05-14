import { AuditableRecord } from '../common/auditable-record.interface';

export interface Contract extends AuditableRecord {
  date?: Date | null;
  title?: string | null;
  content?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  totalAmount?: number | null;
  ownConsumption?: boolean | null;
  customerId?: number | null;
}

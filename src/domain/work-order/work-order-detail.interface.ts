import { AuditableRecord } from '../common/auditable-record.interface';
import { WorkOrderStatus } from '../common/status.types';

export interface WorkOrderDetail extends AuditableRecord {
  workOrderId?: number | null;
  productId?: number | null;
  status?: WorkOrderStatus | null;
  scheduledAt?: Date | null;
  rescheduledAt?: Date | null;
  executedAt?: Date | null;
  amount?: number | null;
}

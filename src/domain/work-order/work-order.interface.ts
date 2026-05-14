import { AuditableRecord } from '../common/auditable-record.interface';
import { WorkOrderStatus } from '../common/status.types';

export interface WorkOrder extends AuditableRecord {
  customerId?: number | null;
  mediaChannelId?: number | null;
  productId?: number | null;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  registeredAt: Date;
  totalAmount?: number | null;
  source?: string | null;
  status?: WorkOrderStatus | null;
  contractId?: number | null;
  salesOrderId?: number | null;
}

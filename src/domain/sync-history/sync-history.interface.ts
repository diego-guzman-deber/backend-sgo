import { SyncHistoryStatus } from '../common/status.types';

export interface SyncHistory {
  id: number;
  entity: string;
  syncStartedAt: Date;
  syncFinishedAt?: Date | null;
  processedRecords: number;
  dataRangeFrom?: Date | null;
  dataRangeTo?: Date | null;
  status?: SyncHistoryStatus | null;
  errorMessage?: string | null;
  createdAt: Date;
}

export interface AuditableRecord {
  id: number;
  externalId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  syncedAt: Date;
}

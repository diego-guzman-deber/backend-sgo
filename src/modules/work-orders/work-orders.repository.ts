import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';

@Injectable()
export class WorkOrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  getStatus(): string {
    return 'Work Orders module ready';
  }

  /**
   * Filtra work_orders por año usando start_date.
   * SELECT * FROM work_order
   *   WHERE start_date >= '{year}-01-01' AND start_date < '{year+1}-01-01'
   *   LIMIT {limit};
   */
  async findWorkOrdersByYear(year: number, limit: number) {
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const startOfNextYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    return this.prisma.work_order.findMany({
      where: {
        startDate: {
          gte: startOfYear,
          lt: startOfNextYear,
        },
        deletedAt: null,
      },
      take: limit,
      orderBy: { startDate: 'asc' },
      include: {
        customer: {
          select: {
            id: true,
            externalId: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        product: {
          select: { id: true, externalId: true, name: true },
        },
        mediaChannel: {
          select: { id: true, externalId: true, name: true },
        },
      },
    });
  }

  /**
   * Filtra work_orders en un rango de fechas usando start_date.
   * SELECT * FROM work_order
   *   WHERE start_date >= 'from' AND start_date <= 'to'
   *   LIMIT {limit};
   */
  async findWorkOrdersByDateRange(from: Date, to: Date, limit: number) {
    return this.prisma.work_order.findMany({
      where: {
        startDate: {
          gte: from,
          lte: to,
        },
        deletedAt: null,
      },
      take: limit,
      orderBy: { startDate: 'asc' },
      include: {
        customer: {
          select: {
            id: true,
            externalId: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        product: {
          select: { id: true, externalId: true, name: true },
        },
        mediaChannel: {
          select: { id: true, externalId: true, name: true },
        },
      },
    });
  }
}

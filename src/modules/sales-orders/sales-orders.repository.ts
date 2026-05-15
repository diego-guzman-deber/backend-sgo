import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';

@Injectable()
export class SalesOrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  getStatus(): string {
    return 'Sales Orders module ready';
  }

  /**
   * Filtra sales_orders por año usando el campo nativo `year`.
   * SELECT * FROM sales_order WHERE year = {year} LIMIT {limit};
   */
  async findSalesOrdersByYear(year: number, limit: number) {
    return this.prisma.sales_order.findMany({
      where: {
        year,
        deletedAt: null,
      },
      take: limit,
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
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
        agent: {
          select: { id: true, externalId: true, name: true },
        },
      },
    });
  }

  /**
   * Filtra sales_orders por rango de fechas usando createdAt.
   * (sales_order no tiene start_date, se usa created_at)
   * SELECT * FROM sales_order
   *   WHERE created_at >= 'from' AND created_at <= 'to'
   *   LIMIT {limit};
   */
  async findSalesOrdersByDateRange(from: Date, to: Date, limit: number) {
    return this.prisma.sales_order.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
        deletedAt: null,
      },
      take: limit,
      orderBy: { createdAt: 'asc' },
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
        agent: {
          select: { id: true, externalId: true, name: true },
        },
      },
    });
  }
}

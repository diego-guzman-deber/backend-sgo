import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';

@Injectable()
export class ContractsRepository {
  constructor(private readonly prisma: PrismaService) {}

  getStatus(): string {
    return 'Contracts module ready';
  }

  /**
   * Devuelve los contratos cuyo start_date cae dentro del año indicado.
   * Equivale a:
   *   SELECT * FROM contract
   *   WHERE start_date >= '{year}-01-01' AND start_date < '{year+1}-01-01'
   *   LIMIT {limit};
   */
  async findContractsByYear(year: number, limit: number) {
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const startOfNextYear = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    return this.prisma.contract.findMany({
      where: {
        startDate: {
          gte: startOfYear,
          lt: startOfNextYear,
        },
      },
      take: limit,
      orderBy: {
        startDate: 'asc',
      },
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
      },
    });
  }

  /**
   * Devuelve los contratos cuyo start_date cae dentro del rango [from, to].
   * Equivale a:
   *   SELECT * FROM contract
   *   WHERE start_date >= 'from' AND start_date <= 'to'
   *   LIMIT {limit};
   */
  async findContractsByDateRange(from: Date, to: Date, limit: number) {
    return this.prisma.contract.findMany({
      where: {
        startDate: {
          gte: from,
          lte: to,
        },
      },
      take: limit,
      orderBy: {
        startDate: 'asc',
      },
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
      },
    });
  }
}

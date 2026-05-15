import { Injectable } from '@nestjs/common';
import { SalesOrdersRepository } from './sales-orders.repository';
import { ExcelService } from '../../common/excel/excel.service';
import { SalesOrderHistoryByYearDto } from './dto/sales-order-history-by-year.dto';
import { SalesOrderHistoryByDateRangeDto } from './dto/sales-order-history-by-date-range.dto';

@Injectable()
export class SalesOrdersService {
  constructor(
    private readonly salesOrdersRepository: SalesOrdersRepository,
    private readonly excelService: ExcelService,
  ) {}

  getStatus(): string {
    return this.salesOrdersRepository.getStatus();
  }

  /** Historial por año — usa el campo nativo `year` de sales_order */
  async getHistoryByYear(query: SalesOrderHistoryByYearDto) {
    const year = query.year ?? new Date().getFullYear();
    const limit = query.limit ?? 300;
    const data = await this.salesOrdersRepository.findSalesOrdersByYear(year, limit);
    return { year, total: data.length, data };
  }

  /** Historial por rango de fechas — filtra sobre createdAt */
  async getHistoryByDateRange(query: SalesOrderHistoryByDateRangeDto) {
    const limit = query.limit ?? 300;
    const data = await this.salesOrdersRepository.findSalesOrdersByDateRange(
      query.from,
      query.to,
      limit,
    );
    return { from: query.from, to: query.to, total: data.length, data };
  }

  /** Prepara columnas + filas para exportar a Excel */
  async prepareExcelExport(query: SalesOrderHistoryByDateRangeDto) {
    const limit = query.limit ?? 1000;
    const records = await this.salesOrdersRepository.findSalesOrdersByDateRange(
      query.from,
      query.to,
      limit,
    );

    const columns = [
      { header: 'ID', key: 'id', width: 10, align: 'center' as const },
      { header: 'ID Externo', key: 'externalId', width: 18 },
      { header: 'Año', key: 'year', width: 8, align: 'center' as const },
      { header: 'Mes', key: 'month', width: 8, align: 'center' as const },
      { header: 'Cliente', key: 'customerName', width: 30 },
      { header: 'Agente', key: 'agentName', width: 25 },
      { header: 'Total (Bs.)', key: 'total', width: 14, align: 'right' as const, numFmt: '#,##0.00' },
      { header: 'Creado', key: 'createdAt', width: 18, align: 'center' as const },
    ];

    const rows = records.map((r) => ({
      id: Number(r.id),
      externalId: r.externalId ?? 'N/A',
      year: r.year ?? '',
      month: r.month ?? '',
      customerName: r.customer?.name ?? 'Desconocido',
      agentName: r.agent?.name ?? 'N/A',
      total: r.total ? Number(r.total) : 0,
      createdAt: r.createdAt ? r.createdAt.toISOString().split('T')[0] : '',
    }));

    return { columns, rows };
  }
}

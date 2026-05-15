import { Injectable } from '@nestjs/common';
import { WorkOrdersRepository } from './work-orders.repository';
import { ExcelService } from '../../common/excel/excel.service';
import { WorkOrderHistoryByYearDto } from './dto/work-order-history-by-year.dto';
import { WorkOrderHistoryByDateRangeDto } from './dto/work-order-history-by-date-range.dto';

@Injectable()
export class WorkOrdersService {
  constructor(
    private readonly workOrdersRepository: WorkOrdersRepository,
    private readonly excelService: ExcelService,
  ) {}

  getStatus(): string {
    return this.workOrdersRepository.getStatus();
  }

  /** Historial por año (default = año actual) */
  async getHistoryByYear(query: WorkOrderHistoryByYearDto) {
    const year = query.year ?? new Date().getFullYear();
    const limit = query.limit ?? 300;
    const data = await this.workOrdersRepository.findWorkOrdersByYear(year, limit);
    return { year, total: data.length, data };
  }

  /** Historial por rango de fechas (filtra sobre start_date) */
  async getHistoryByDateRange(query: WorkOrderHistoryByDateRangeDto) {
    const limit = query.limit ?? 300;
    const data = await this.workOrdersRepository.findWorkOrdersByDateRange(
      query.from,
      query.to,
      limit,
    );
    return { from: query.from, to: query.to, total: data.length, data };
  }

  /** Prepara columnas + filas para exportar a Excel */
  async prepareExcelExport(query: WorkOrderHistoryByDateRangeDto) {
    const limit = query.limit ?? 1000;
    const records = await this.workOrdersRepository.findWorkOrdersByDateRange(
      query.from,
      query.to,
      limit,
    );

    const columns = [
      { header: 'ID', key: 'id', width: 10, align: 'center' as const },
      { header: 'ID Externo', key: 'externalId', width: 18 },
      { header: 'Descripción', key: 'description', width: 35 },
      { header: 'Cliente', key: 'customerName', width: 30 },
      { header: 'Producto', key: 'productName', width: 25 },
      { header: 'Canal', key: 'mediaChannelName', width: 20 },
      { header: 'Estado', key: 'status', width: 14, align: 'center' as const },
      { header: 'Fuente', key: 'source', width: 14 },
      { header: 'Fecha Inicio', key: 'startDate', width: 14, align: 'center' as const },
      { header: 'Fecha Fin', key: 'endDate', width: 14, align: 'center' as const },
      { header: 'Total (Bs.)', key: 'totalAmount', width: 14, align: 'right' as const, numFmt: '#,##0.00' },
    ];

    const rows = records.map((r) => ({
      id: Number(r.id),
      externalId: r.externalId ?? 'N/A',
      description: r.description ?? 'Sin descripción',
      customerName: r.customer?.name ?? 'Desconocido',
      productName: r.product?.name ?? 'N/A',
      mediaChannelName: r.mediaChannel?.name ?? 'N/A',
      status: r.status ?? 'N/A',
      source: r.source ?? 'N/A',
      startDate: r.startDate ? r.startDate.toISOString().split('T')[0] : '',
      endDate: r.endDate ? r.endDate.toISOString().split('T')[0] : '',
      totalAmount: r.totalAmount ? Number(r.totalAmount) : 0,
    }));

    return { columns, rows };
  }
}

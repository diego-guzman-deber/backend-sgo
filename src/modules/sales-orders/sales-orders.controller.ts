import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { SalesOrdersService } from './sales-orders.service';
import { ExcelService } from '../../common/excel/excel.service';
import { SalesOrderHistoryByYearDto } from './dto/sales-order-history-by-year.dto';
import { SalesOrderHistoryByDateRangeDto } from './dto/sales-order-history-by-date-range.dto';

@Controller('sales-orders')
export class SalesOrdersController {
  constructor(
    private readonly salesOrdersService: SalesOrdersService,
    private readonly excelService: ExcelService,
  ) {}

  @Get()
  getStatus(): string {
    return this.salesOrdersService.getStatus();
  }

  /**
   * GET /api/sales-orders/history?year=2026&limit=300
   * Retorna pedidos del año indicado (default: año actual).
   * Usa el campo nativo `year` de sales_order.
   */
  @Get('history')
  async getHistoryByYear(@Query() query: SalesOrderHistoryByYearDto) {
    return this.salesOrdersService.getHistoryByYear(query);
  }

  /**
   * GET /api/sales-orders/history/range?from=2018-01-01&to=2026-12-31&limit=300
   * Retorna pedidos en el rango de fechas (filtra sobre created_at).
   */
  @Get('history/range')
  async getHistoryByDateRange(@Query() query: SalesOrderHistoryByDateRangeDto) {
    return this.salesOrdersService.getHistoryByDateRange(query);
  }

  /**
   * GET /api/sales-orders/history/range/excel?from=2018-01-01&to=2026-12-31
   * Descarga el Excel con los mismos parámetros del filtro.
   * Usar: window.open('/api/sales-orders/history/range/excel?from=...&to=...')
   */
  @Get('history/range/excel')
  async exportToExcel(
    @Query() query: SalesOrderHistoryByDateRangeDto,
    @Res() res: Response,
  ) {
    const { columns, rows } = await this.salesOrdersService.prepareExcelExport(query);
    const from = query.from.toISOString().split('T')[0];
    const to = query.to.toISOString().split('T')[0];

    await this.excelService.sendExcelFile(
      res,
      `pedidos_${from}_${to}`,
      'Pedidos',
      columns,
      rows,
    );
  }
}

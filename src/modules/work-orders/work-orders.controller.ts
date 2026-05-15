import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { WorkOrdersService } from './work-orders.service';
import { ExcelService } from '../../common/excel/excel.service';
import { WorkOrderHistoryByYearDto } from './dto/work-order-history-by-year.dto';
import { WorkOrderHistoryByDateRangeDto } from './dto/work-order-history-by-date-range.dto';

@Controller('work-orders')
export class WorkOrdersController {
  constructor(
    private readonly workOrdersService: WorkOrdersService,
    private readonly excelService: ExcelService,
  ) {}

  @Get()
  getStatus(): string {
    return this.workOrdersService.getStatus();
  }

  /**
   * GET /api/work-orders/history?year=2026&limit=300
   * Retorna órdenes de trabajo del año indicado (default: año actual).
   * Filtra sobre start_date.
   */
  @Get('history')
  async getHistoryByYear(@Query() query: WorkOrderHistoryByYearDto) {
    return this.workOrdersService.getHistoryByYear(query);
  }

  /**
   * GET /api/work-orders/history/range?from=2018-01-01&to=2026-12-31&limit=300
   * Retorna órdenes de trabajo en el rango de fechas (sobre start_date).
   */
  @Get('history/range')
  async getHistoryByDateRange(@Query() query: WorkOrderHistoryByDateRangeDto) {
    return this.workOrdersService.getHistoryByDateRange(query);
  }

  /**
   * GET /api/work-orders/history/range/excel?from=2018-01-01&to=2026-12-31
   * Descarga el Excel con los mismos parámetros del filtro.
   * Usar: window.open('/api/work-orders/history/range/excel?from=...&to=...')
   */
  @Get('history/range/excel')
  async exportToExcel(
    @Query() query: WorkOrderHistoryByDateRangeDto,
    @Res() res: Response,
  ) {
    const { columns, rows } = await this.workOrdersService.prepareExcelExport(query);
    const from = query.from.toISOString().split('T')[0];
    const to = query.to.toISOString().split('T')[0];

    await this.excelService.sendExcelFile(
      res,
      `ordenes_trabajo_${from}_${to}`,
      'Órdenes de Trabajo',
      columns,
      rows,
    );
  }
}

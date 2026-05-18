import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ContractsService } from './contracts.service';
import { ExcelService } from '../../common/excel/excel.service';
import { ContractHistoryByYearDto } from './dto/contract-history-by-year.dto';
import { ContractHistoryByDateRangeDto } from './dto/contract-history-by-date-range.dto';

@Controller('agreements')
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly excelService: ExcelService,
  ) {}

  @Get()
  getStatus(): string {
    return this.contractsService.getStatus();
  }

  /**
   * GET /api/agreements/history?year=2026&limit=300
   *
   * Acuerdos cuyo start_date está dentro del año indicado.
   */
  @Get('history')
  async getAgreementHistoryByYear(@Query() query: ContractHistoryByYearDto) {
    return this.contractsService.getAgreementHistoryByYear(query);
  }

  /**
   * GET /api/contracts/history/range?from=2018-01-01&to=2026-12-31&limit=300
   *
   * Devuelve JSON con los contratos del rango. Úsalo para mostrar la tabla en el frontend.
   */
  @Get('history/range')
  async getContractHistoryByDateRange(
    @Query() query: ContractHistoryByDateRangeDto,
  ) {
    return this.contractsService.getContractHistoryByDateRange(query);
  }

  /**
   * GET /api/contracts/history/range/excel?from=2018-01-01&to=2026-12-31
   *
   * Descarga el Excel con los MISMOS parámetros del filtro de la tabla.
   * El frontend solo necesita hacer window.open() o window.location.href con esta URL.
   */
  @Get('history/range/excel')
  async exportContractHistoryByDateRange(
    @Query() query: ContractHistoryByDateRangeDto,
    @Res() res: Response,
  ) {
    const { columns, rows } =
      await this.contractsService.exportContractHistoryByDateRange(query);

    const from = query.from.toISOString().split('T')[0];
    const to = query.to.toISOString().split('T')[0];

    await this.excelService.sendExcelFile(
      res,
      `contratos_${from}_${to}`,
      'Contratos',
      columns,
      rows,
    );
  }
}

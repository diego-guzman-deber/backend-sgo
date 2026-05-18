import { Injectable } from '@nestjs/common';
import { ContractsRepository } from './contracts.repository';
import { ContractHistoryByYearDto } from './dto/contract-history-by-year.dto';
import { ContractHistoryByDateRangeDto } from './dto/contract-history-by-date-range.dto';
import { ExcelService } from '../../common/excel/excel.service';

@Injectable()
export class ContractsService {
  constructor(
    private readonly contractsRepository: ContractsRepository,
    private readonly excelService: ExcelService,
  ) {}

  getStatus(): string {
    return this.contractsRepository.getStatus();
  }

  /**
   * Retorna el historial de acuerdos activos filtrado por año.
   * Si no se pasa año, usa el año actual.
   */
  async getAgreementHistoryByYear(query: ContractHistoryByYearDto) {
    const year = query.year ?? new Date().getFullYear();
    const limit = query.limit ?? 300;

    const agreements = await this.contractsRepository.findAgreementsByYear(
      year,
      limit,
    );

    return {
      year,
      total: agreements.length,
      acuerdos: agreements,
    };
  }

  /**
   * Retorna el historial de contratos filtrado por rango de fechas exacto.
   * from y to aplican sobre start_date del contrato.
   */
  async getContractHistoryByDateRange(query: ContractHistoryByDateRangeDto) {
    const limit = query.limit ?? 300;

    const contracts = await this.contractsRepository.findContractsByDateRange(
      query.from,
      query.to,
      limit,
    );

    return {
      from: query.from,
      to: query.to,
      total: contracts.length,
      data: contracts,
    };
  }

  /**
   * Prepara la data de contratos por rango de fechas lista para exportar a Excel.
   * Retorna columnas + filas normalizadas para pasarle al ExcelService.
   */
  async exportContractHistoryByDateRange(query: ContractHistoryByDateRangeDto) {
    const limit = query.limit ?? 1000;
    const contracts = await this.contractsRepository.findContractsByDateRange(
      query.from,
      query.to,
      limit,
    );

    const columns = [
      { header: 'ID', key: 'id', width: 10, align: 'center' as const },
      { header: 'ID Externo', key: 'externalId', width: 18 },
      { header: 'Título', key: 'title', width: 35 },
      { header: 'Cliente', key: 'customerName', width: 30 },
      { header: 'Fecha Inicio', key: 'startDate', width: 14, align: 'center' as const },
      { header: 'Fecha Fin', key: 'endDate', width: 14, align: 'center' as const },
      { header: 'Total (Bs.)', key: 'totalAmount', width: 14, align: 'right' as const, numFmt: '#,##0.00' },
      { header: 'Activo', key: 'isActive', width: 10, align: 'center' as const },
    ];

    const rows = contracts.map((c) => ({
      id: Number(c.id),
      externalId: c.externalId ?? 'N/A',
      title: c.title ?? 'Sin Título',
      customerName: c.customer?.name ?? 'Desconocido',
      startDate: c.startDate ? c.startDate.toISOString().split('T')[0] : '',
      endDate: c.endDate ? c.endDate.toISOString().split('T')[0] : '',
      totalAmount: c.totalAmount ? Number(c.totalAmount) : 0,
      isActive: c.isActive ? 'Sí' : 'No',
    }));

    return { columns, rows };
  }
}

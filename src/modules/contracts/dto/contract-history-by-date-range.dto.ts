import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, Max, Min } from 'class-validator';

export class ContractHistoryByDateRangeDto {
  /**
   * Fecha de inicio del rango (ISO 8601: YYYY-MM-DD).
   * Ej: 2018-01-01
   */
  @Type(() => Date)
  @IsDate({ message: 'from debe ser una fecha válida (YYYY-MM-DD).' })
  from!: Date;

  /**
   * Fecha de fin del rango (ISO 8601: YYYY-MM-DD).
   * Ej: 2026-12-31
   */
  @Type(() => Date)
  @IsDate({ message: 'to debe ser una fecha válida (YYYY-MM-DD).' })
  to!: Date;

  /**
   * Límite de registros (máx 1000, default 300).
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number = 300;
}

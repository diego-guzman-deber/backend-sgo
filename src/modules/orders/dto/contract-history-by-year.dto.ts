import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ContractHistoryByYearDto {
  /**
   * Año a filtrar (ej: 2026). Si no se envía, usa el año actual.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El año debe ser un número entero.' })
  @Min(2000, { message: 'El año mínimo es 2000.' })
  @Max(2030, { message: 'El año máximo es 2030.' })
  year?: number;

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

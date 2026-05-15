import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class WorkOrderHistoryByYearDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El año debe ser un número entero.' })
  @Min(2000, { message: 'El año mínimo es 2000.' })
  @Max(2100, { message: 'El año máximo es 2100.' })
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number = 300;
}

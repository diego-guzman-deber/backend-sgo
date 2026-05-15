import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, Max, Min } from 'class-validator';

export class SalesOrderHistoryByDateRangeDto {
  @Type(() => Date)
  @IsDate({ message: 'from debe ser una fecha válida (YYYY-MM-DD).' })
  from!: Date;

  @Type(() => Date)
  @IsDate({ message: 'to debe ser una fecha válida (YYYY-MM-DD).' })
  to!: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number = 300;
}

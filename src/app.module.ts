import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './config/database/prisma.module';
import { ExcelModule } from './common/excel/excel.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { WorkOrdersModule } from './modules/work-orders/work-orders.module';
import { SalesOrdersModule } from './modules/sales-orders/sales-orders.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    ExcelModule,
    AuthModule,
    UsersModule,
    ContractsModule,
    WorkOrdersModule,
    SalesOrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';
import { TestModule } from './test/test.module';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [AuthModule, UsersModule, OrdersModule, TestModule, CatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

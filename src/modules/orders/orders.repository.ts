import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersRepository {
  getStatus(): string {
    return 'Orders module ready';
  }
}
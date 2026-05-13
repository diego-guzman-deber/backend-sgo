import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  getStatus(): string {
    return 'Users module ready';
  }
}
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  getStatus(): string {
    return 'Auth module ready';
  }
}
import { HttpException } from '@nestjs/common';

export default class TokenExpiredException extends HttpException {
  constructor() {
    super('Token expired', 498);
  }
}

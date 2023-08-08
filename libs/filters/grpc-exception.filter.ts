import { Catch } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

@Catch()
export class GrpcExceptionFilter extends HttpExceptionFilter {
    constructor() {
        super();
        this.isGrpc = true;
    }
}

import { ArgumentsHost, Catch } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { throwError } from 'rxjs';
import { status } from '@grpc/grpc-js';

@Catch()
export class GrpcExceptionFilter extends HttpExceptionFilter {
    protected isMicroservice: boolean = true;

    protected responseError(host: ArgumentsHost, code, message, errors = null) {
        return throwError(() => ({
            message: JSON.stringify({
                message: message,
                errors: errors,
                code: code
            }),
            code: status.ABORTED
        }));
    }
}

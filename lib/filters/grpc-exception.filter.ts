import { status } from '@grpc/grpc-js';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { HttpExceptionFilter } from './http-exception.filter';

@Catch()
export class GrpcExceptionFilter extends HttpExceptionFilter {
    protected isMicroservice: boolean = true;

    protected responseError(
        host: ArgumentsHost,
        code: number,
        message: string,
        errors: string | object = null
    ): Observable<never> {
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

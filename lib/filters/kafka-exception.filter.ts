import { ArgumentsHost, Catch } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { Observable, throwError } from 'rxjs';

@Catch()
export class KafkaExceptionFilter extends HttpExceptionFilter {
    protected isMicroservice: boolean = true;

    protected responseError(
        host: ArgumentsHost,
        code: number,
        message: string,
        errors: string | object = null
    ): Observable<never> {
        return throwError(() =>
            JSON.stringify({
                message: message,
                errors: errors,
                code: code
            })
        );
    }
}

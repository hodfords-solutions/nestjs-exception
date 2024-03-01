import { ArgumentsHost, Catch } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { throwError } from 'rxjs';

@Catch()
export class KafkaExceptionFilter extends HttpExceptionFilter {
    protected isMicroservice: boolean = true;

    protected responseError(host: ArgumentsHost, code, message, errors = null) {
        return throwError(() =>
            JSON.stringify({
                message: message,
                errors: errors,
                code: code
            })
        );
    }
}

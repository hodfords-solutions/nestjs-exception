import { ArgumentsHost } from '@nestjs/common';
import { throwError } from 'rxjs';
import { status } from '@grpc/grpc-js';
import { HTTP_STATUS_CODE } from '../constants/grpc_status_code_mapping.constant';

export abstract class BaseExceptionFilter {
    protected isMicroservice: boolean = false;
    protected isGrpc: boolean = false;

    protected getLanguage(host: ArgumentsHost) {
        return host.switchToHttp().getRequest().i18nLang;
    }

    protected responseError(host: ArgumentsHost, code, message, errors = null) {
        if (this.isGrpc) {
            return throwError(() => ({
                message: message,
                details: errors.message[0],
                code: HTTP_STATUS_CODE[code] ?? status.UNKNOWN
            }));
        } else if (this.isMicroservice) {
            return throwError(() =>
                JSON.stringify({
                    message: message,
                    errors: errors,
                    code: code
                })
            );
        } else {
            const ctx = host.switchToHttp();
            ctx.getResponse().status(code).json({
                message: message,
                errors: errors
            });
        }
    }
}

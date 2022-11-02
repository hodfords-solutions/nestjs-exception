import { ArgumentsHost } from '@nestjs/common';
import { throwError } from 'rxjs';

export abstract class BaseExceptionFilter {
    protected isMicroservice: boolean = false;

    protected getLanguage(host: ArgumentsHost) {
        return host.switchToHttp().getRequest().i18nLang;
    }

    protected responseError(host: ArgumentsHost, code, message, errors = null) {
        if (this.isMicroservice) {
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

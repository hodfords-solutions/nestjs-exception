import { ArgumentsHost } from '@nestjs/common';

export abstract class BaseExceptionFilter {
    protected isMicroservice: boolean = false;

    protected getLanguage(host: ArgumentsHost) {
        return host.switchToHttp().getRequest().i18nLang;
    }

    protected responseError(host: ArgumentsHost, code, message, errors = null) {
        const ctx = host.switchToHttp();
        ctx.getResponse().status(code).json({
            message: message,
            errors: errors
        });
    }
}

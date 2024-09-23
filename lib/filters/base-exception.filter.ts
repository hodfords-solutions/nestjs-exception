import { ArgumentsHost } from '@nestjs/common';

export abstract class BaseExceptionFilter {
    protected isMicroservice: boolean = false;

    protected getLanguage(host: ArgumentsHost): string {
        return host.switchToHttp().getRequest().i18nLang;
    }

    protected responseError(host: ArgumentsHost, code: number, message: string, errors: string | object = null): void {
        const ctx = host.switchToHttp();
        ctx.getResponse().status(code).json({
            message: message,
            errors: errors
        });
    }
}

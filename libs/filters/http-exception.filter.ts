import { trans } from '@hodfords/nestjs-cls-translation';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    PayloadTooLargeException
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { UuidException } from '../exceptions/uuid.exception';
import { ValidateException } from '../exceptions/validate.exception';
import { BaseExceptionFilter } from './base-exception.filter';
import { ValidatorExceptionFilter } from './validator-exception.filter';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
    protected isMicroservice: boolean = false;

    catch(exception, host: ArgumentsHost) {
        let language = this.getLanguage(host);
        if (exception instanceof EntityNotFoundError) {
            return this.catchEntityNotFound(exception, host);
        } else if (exception instanceof UuidException) {
            const args = {
                field: exception.field
            };
            return this.catchBadRequestWithArgs(host, 'error.field_malformed', language, args);
        } else if (exception instanceof ValidateException) {
            return new ValidatorExceptionFilter(this.isMicroservice, this.responseError).catch(exception, host);
        } else if (exception instanceof PayloadTooLargeException) {
            return this.catchPayloadTooLargeException(host, 'error.multer.file_too_large', language);
        } else if (exception.type === 'entity.too.large') {
            return this.catchPayloadTooLargeException(host, 'error.payload_too_large', language);
        } else if (exception instanceof HttpException) {
            return this.catchHttpException(exception, host, language);
        } else if (['JsonWebTokenError', 'TokenExpiredError'].includes(exception.name)) {
            return this.responseError(host, HttpStatus.UNAUTHORIZED, exception.message);
        } else {
            return this.catchAnotherException(exception, host);
        }
    }

    catchAnotherException(exception, host: ArgumentsHost) {
        console.error(exception);
        let language = this.getLanguage(host);
        let message = trans('error.an_error_occurred', { lang: language });
        return this.responseError(host, HttpStatus.INTERNAL_SERVER_ERROR, message);
    }

    catchHttpException(exception, host: ArgumentsHost, language: string) {
        const response = exception.getResponse();
        if (response && response.translate) {
            let message = trans(response.translate, {
                lang: language,
                args: response.args
            });
            delete response.translate;
            delete response.args;
            return this.responseError(host, exception.getStatus(), message, response);
        } else {
            return this.responseError(host, exception.getStatus(), exception.message, exception.getResponse());
        }
    }

    catchEntityNotFound(exception, host: ArgumentsHost) {
        const messageRegex = /"[a-zA-Z]+"/.exec(exception.message);
        let message = exception.message;
        if (messageRegex) {
            message = messageRegex[0].replace('"', '').replace('"', '');
        }
        return this.responseError(
            host,
            HttpStatus.NOT_FOUND,
            trans(`error.not_found.${message}`, {
                lang: host.switchToHttp().getRequest().i18nLang
            })
        );
    }

    catchBadRequestWithArgs(host: ArgumentsHost, messageKey: string, language: string, args: any) {
        let message = trans(messageKey, {
            lang: language,
            args
        });
        return this.responseError(host, HttpStatus.BAD_REQUEST, message);
    }

    catchPayloadTooLargeException(host: ArgumentsHost, messageKey: string, language: string) {
        const message = trans(messageKey, { lang: language });
        return this.responseError(host, HttpStatus.PAYLOAD_TOO_LARGE, message);
    }
}

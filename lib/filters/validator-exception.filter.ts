import { trans } from '@hodfords/nestjs-cls-translation';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { startCase } from 'es-toolkit';
import { ValidateException } from '../exceptions/validate.exception.js';
import { BaseExceptionFilter } from './base-exception.filter.js';
import { ValidationErrorException } from '../types/validation-error-exception.type.js';
import { ValidationErrorExceptionMessage } from '../types/validation-error-exception-message.type.js';

@Catch()
export class ValidatorExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
    constructor(
        isMicroservice: boolean,
        public responseError: (host: ArgumentsHost, code: number, message: string, errors: string | object) => void
    ) {
        super();
        this.isMicroservice = isMicroservice;
    }

    catch(exception: ValidateException, host: ArgumentsHost): void {
        const language = this.getLanguage(host);
        const response = exception.getResponse() as Record<string, ValidationErrorException>;
        this.convertValidationErrors(response, language);
        return this.responseError(host, exception.getStatus(), exception.message, exception.getResponse());
    }

    convertValidationErrors(validatorError: Record<string, ValidationErrorException>, language: string): void {
        for (const key of Object.keys(validatorError)) {
            const messages: string[] = [];
            for (const message of validatorError[key].messages) {
                messages.push(this.getValidationMessage(message, language));
            }
            validatorError[key].messages = messages;
            if (validatorError[key].children && Object.keys(validatorError[key].children).length) {
                this.convertValidationErrors(validatorError[key].children, language);
            }
        }
    }

    getValidationMessage(validatorMessage: ValidationErrorExceptionMessage, language: string): string {
        let translateMessage = '';
        let args: Record<string, unknown> = {};
        const isDetail = typeof validatorMessage === 'object';
        const key = `validation.${isDetail ? validatorMessage.message || validatorMessage : validatorMessage}`;

        if (isDetail) {
            args = { ...validatorMessage.detail, property: startCase(validatorMessage.detail.property ?? '') };
        }

        if (isDetail && validatorMessage.message.startsWith('each value in')) {
            translateMessage += trans('each value in', { lang: language });
            translateMessage += ' ';
            validatorMessage.message = validatorMessage.message.replace('each value in ', '');
        }

        translateMessage += trans(key, {
            lang: language,
            args
        });
        return translateMessage;
    }
}

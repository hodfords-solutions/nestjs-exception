import { trans } from '@hodfords/nestjs-cls-translation';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { startCase } from 'lodash';
import { ValidateException } from '../exceptions/validate.exception';
import { BaseExceptionFilter } from './base-exception.filter';

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
        const response = exception.getResponse();
        this.convertValidationErrors(response, language);
        return this.responseError(host, exception.getStatus(), exception.message, exception.getResponse());
    }

    convertValidationErrors(validatorError, language: string): void {
        for (const key of Object.keys(validatorError)) {
            const messages = [];
            for (const message of validatorError[key].messages) {
                messages.push(this.getValidationMessage(message, language));
            }
            validatorError[key].messages = messages;
            if (validatorError[key].children && Object.keys(validatorError[key].children).length) {
                this.convertValidationErrors(validatorError[key].children, language);
            }
        }
    }

    getValidationMessage(validatorMessage, language: string): string {
        let translateMessage = '';
        let args = {};
        const key = `validation.${validatorMessage?.message || validatorMessage}`;

        if (typeof validatorMessage === 'object') {
            args = { ...validatorMessage.detail, property: startCase(validatorMessage.detail.property) };
        }

        if (typeof validatorMessage === 'object' && validatorMessage.message.startsWith('each value in')) {
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

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';
import { I18nService } from 'nestjs-i18n';
import { ValidateException } from '../exceptions/validate.exception';
import { startCase } from 'lodash';
import { trans } from '@hodfords/nestjs-cls-translation';

@Catch()
export class ValidatorExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
    constructor(isMicroservice: boolean, isGrpc: boolean) {
        super();
        this.isMicroservice = isMicroservice;
        this.isGrpc = isGrpc;
    }

    catch(exception: ValidateException, host: ArgumentsHost) {
        let language = this.getLanguage(host);
        let response = exception.getResponse();
        this.convertValidationErrors(response, language);
        return this.responseError(host, exception.getStatus(), exception.message, exception.getResponse());
    }

    convertValidationErrors(validatorError, language: string) {
        for (let key of Object.keys(validatorError)) {
            let messages = [];
            for (let message of validatorError[key].messages) {
                messages.push(this.getValidationMessage(message, language));
            }
            validatorError[key].messages = messages;
            if (validatorError[key].children && Object.keys(validatorError[key].children).length) {
                this.convertValidationErrors(validatorError[key].children, language);
            }
        }
    }

    getValidationMessage(validatorMessage, language: string) {
        let translateMessage = '';
        let args = {};
        let key = `validation.${validatorMessage?.message || validatorMessage}`;

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

import { HttpException, HttpStatus } from '@nestjs/common';
import { isString } from '@nestjs/common/utils/shared.utils';
import { ValidationError } from '../interfaces/validation-error.interface';
import { ValidationErrorExceptionDetail } from '../types/validation-error-exception-detail.type';
import { ValidationErrorException } from '../types/validation-error-exception.type';

export class ValidateException extends HttpException {
    constructor(errors: ValidationError[]) {
        super({}, HttpStatus.UNPROCESSABLE_ENTITY);
        this['response' as any] = this.convertValidationErrors(errors);
    }

    private convertValidationErrors(
        errors: ValidationError[],
        parent: ValidationError = null
    ): Record<string, ValidationErrorException> {
        let newErrors = {};
        errors.forEach((error) => {
            if (!parent || error.property !== parent.property) {
                newErrors[error.property] = this.convertValidationError(error);
            }
        });
        return newErrors;
    }

    private convertValidationError(error: ValidationError): ValidationErrorException {
        let newError: ValidationErrorException = {
            children: undefined,
            messages: []
        };
        if (error.constraints) {
            newError.messages = Object.values(error.constraints).map((message: ValidationErrorExceptionDetail) => {
                if (isString(message)) {
                    return {
                        message,
                        detail: {
                            property: error.property
                        }
                    };
                }
                return message;
            });
        }
        if (error.children && Object.keys(error.children).length) {
            error.children.forEach((child: ValidationError) => {
                if (child.property === error.property && child.constraints) {
                    newError.messages = newError.messages.concat(Object.values(child.constraints));
                }
            });
            newError.children = this.convertValidationErrors(error.children, error);
        }

        return newError;
    }
}

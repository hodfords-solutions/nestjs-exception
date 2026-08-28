import { ValidationErrorExceptionMessage } from './validation-error-exception-message.type.js';

export type ValidationErrorException = {
    children?: Record<string, ValidationErrorException>;
    messages: ValidationErrorExceptionMessage[];
};

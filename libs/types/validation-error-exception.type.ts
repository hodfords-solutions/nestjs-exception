import { ValidationErrorExceptionMessage } from './validation-error-exception-message.type';

export type ValidationErrorException = {
    children?: Record<string, ValidationErrorException>;
    messages: ValidationErrorExceptionMessage[];
};

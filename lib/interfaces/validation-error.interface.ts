import { ValidationErrorExceptionMessage } from '../types/validation-error-exception-message.type.js';

export interface ValidationError {
    target?: Record<string, any>;
    property: string;
    value?: any;
    children?: ValidationError[];
    contexts?: {
        [type: string]: any;
    };
    constraints?: {
        [type: string]: ValidationErrorExceptionMessage;
    };
}

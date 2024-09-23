import { ValidateException } from './validate.exception';

export class ValidateFieldException extends ValidateException {
    constructor(property: string, message: string, constraint: string, detail?: NodeJS.Dict<any>) {
        super([
            {
                property,
                constraints: {
                    [constraint]: { message, detail: detail || {} } as any
                }
            }
        ]);
    }
}

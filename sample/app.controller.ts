import { Controller, Get } from '@nestjs/common';
import { UuidException, ValidateFieldException } from '../lib';

@Controller()
export class AppController {
    constructor() {}

    @Get('uuid-exception')
    getUuidException(): void {
        throw new UuidException('id'); // Translation key: 'error.field_malformed'
    }

    @Get('validate-field-exception')
    getValidateFieldException(): void {
        throw new ValidateFieldException('id', 'field_malformed', 'field_malformed'); // Translation key: 'validation.field_malformed'
    }
}

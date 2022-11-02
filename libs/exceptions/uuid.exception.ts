import { HttpException, HttpStatus } from '@nestjs/common';

export class UuidException extends HttpException {
    constructor(public field: string) {
        super({}, HttpStatus.BAD_REQUEST);
    }
}

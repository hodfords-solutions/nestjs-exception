import {Catch} from '@nestjs/common';
import {HttpExceptionFilter} from "./http-exception.filter";

@Catch()
export class MicroserviceExceptionFilter extends HttpExceptionFilter {
    protected isMicroservice: boolean = true;
}

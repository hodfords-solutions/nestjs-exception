import { Module } from '@nestjs/common';
import { HeaderResolver } from 'nestjs-i18n';
import path from 'path';
import { fileURLToPath } from 'url';
import { HttpExceptionFilter } from '../lib/index.js';

import { RequestResolver, TranslationModule } from '@hodfords/nestjs-cls-translation';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const i18nConfig = TranslationModule.forRoot({
    fallbackLanguage: 'en',
    loaderOptions: {
        path: path.join(currentDir, 'i18n/'),
        watch: true
    },
    resolvers: [new HeaderResolver(['language'])],
    defaultLanguageKey: 'language',
    clsResolvers: [new RequestResolver([{ key: 'language', type: 'headers' }])]
});

@Module({
    imports: [i18nConfig],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        }
    ]
})
export class AppModule {}

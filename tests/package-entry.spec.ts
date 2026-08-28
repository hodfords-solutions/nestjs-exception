import { describe, expect, it } from 'vitest';

describe('package entry', () => {
    it('exports something', async () => {
        const mod = await import('../lib/index.js');
        expect(Object.keys(mod).length).toBeGreaterThan(0);
    });

    it('exposes the exception filters', async () => {
        const mod = await import('../lib/index.js');
        expect(typeof mod.HttpExceptionFilter).toBe('function');
        expect(typeof mod.GrpcExceptionFilter).toBe('function');
        expect(typeof mod.KafkaExceptionFilter).toBe('function');
        expect(typeof mod.ValidatorExceptionFilter).toBe('function');
    });

    it('builds a validation exception payload', async () => {
        const { ValidateFieldException } = await import('../lib/index.js');
        const exception = new ValidateFieldException('id', 'field_malformed', 'field_malformed');
        expect(exception.getStatus()).toBe(422);
        expect(exception.getResponse()).toHaveProperty('id');
    });
});

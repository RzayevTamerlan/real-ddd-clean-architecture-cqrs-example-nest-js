import { DomainError } from '@shared/domain/domain-error';
import {PersonName} from "@user/domain/value-objects/person-name.vo";

describe('PersonName Value Object', () => {
    it('should create a valid person name', () => {
        const name = PersonName.create('Valid Name', 'Name');
        expect(name).toBeInstanceOf(PersonName);
        expect(name.getValue()).toBe('Valid Name');
    });

    it('should trim whitespace', () => {
        const name = PersonName.create('  Spaced Name  ', 'Name');
        expect(name.getValue()).toBe('Spaced Name');
    });

    it('should throw an error for a name that is too short', () => {
        const action = () => PersonName.create('A', 'Name');
        expect(action).toThrow('Name must be between 3 and 50 characters.');
    });

    it('should throw an error for a name that is too long', () => {
        const longName = 'a'.repeat(51);
        const action = () => PersonName.create(longName, 'Name');
        expect(action).toThrow('Name must be between 3 and 50 characters.');
    });

    it('should throw an error for a null or undefined name', () => {
        const actionWithUndefined = () => PersonName.create(undefined as any, 'Name');
        expect(actionWithUndefined).toThrow('Name cannot be empty.');
    });
});
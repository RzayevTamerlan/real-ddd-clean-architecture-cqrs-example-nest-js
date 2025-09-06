import { DomainError } from '@shared/domain/domain-error';
import { Status } from '@user/domain/enums/status';
import {
    UserActivatedEvent,
    UserBlockedEvent,
    UserCreatedEvent,
    UserPasswordChangedEvent,
    UserUpdatedEvent,
} from '@user/domain/events';
import { Password } from '@user/domain/value-objects/password.vo';
import {User} from "@user/domain/user.model";

const createUser = (props: any = {}) => {
    const defaultProps = {
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        phone: '+994501234567',
        password: 'Password123!',
    };
    return User.create({ ...defaultProps, ...props });
};

describe('User Aggregate', () => {
    describe('create', () => {
        it('should create a new user with default status', async () => {
            const user = await createUser();

            expect(user).toBeInstanceOf(User);
            expect(user.status).toBe(Status.ACTIVE);
            expect(user.id).toBeDefined();
            expect(user.passwordHash).toBeDefined();
        });

        it('should raise a UserCreatedEvent when a new user is created', async () => {
            const user = await createUser();
            const domainEvents = user.popDomainEvents();

            expect(domainEvents).toHaveLength(1);
            const event = domainEvents[0] as UserCreatedEvent;
            expect(event).toBeInstanceOf(UserCreatedEvent);
            expect(event.aggregateId).toBe(user.id);
            expect(event.payload.email).toBe('john.doe@example.com');
        });
    });

    describe('changePassword', () => {
        it('should successfully change the password with valid old password', async () => {
            const user = await createUser({ password: 'OldPassword123!' });

            await user.changePassword('OldPassword123!', 'NewPassword456!');
            const newPasswordVO = user.props.passwordHash;

            expect(newPasswordVO).toBeInstanceOf(Password);
            const isNewPasswordCorrect = await newPasswordVO!.compare('NewPassword456!');
            expect(isNewPasswordCorrect).toBe(true);

            const domainEvents = user.popDomainEvents();
            expect(domainEvents.find(e => e instanceof UserPasswordChangedEvent)).toBeDefined();
        });

        it('should throw an error if the user is not active', async () => {
            const user = await createUser();
            user.ban();

            const action = user.changePassword('Password123!', 'NewPassword456!');

            await expect(action).rejects.toBeInstanceOf(DomainError);
            await expect(action).rejects.toThrow('Cannot change password for a non-active user.');
        });

        it('should throw an error if user has no password set', async () => {
            const user = await createUser({ password: '' });

            const action = user.changePassword('any', 'NewPassword456!');

            await expect(action).rejects.toBeInstanceOf(DomainError);
            await expect(action).rejects.toThrow('Password change is not available for users without a password set.');
        });

        it('should throw an error if the old password is incorrect', async () => {
            const user = await createUser();

            const action = user.changePassword('WrongOldPassword', 'NewPassword456!');

            await expect(action).rejects.toBeInstanceOf(DomainError);
            await expect(action).rejects.toThrow('The old password you entered is incorrect.');
        });
    });

    describe('ban', () => {
        it('should change status to BANNED', async () => {
            const user = await createUser();
            user.ban();

            expect(user.status).toBe(Status.BANNED);
        });

        it('should raise a UserBlockedEvent', async () => {
            const user = await createUser();
            user.popDomainEvents(); // Clear creation event

            user.ban();
            const domainEvents = user.popDomainEvents();

            expect(domainEvents[0]).toBeInstanceOf(UserBlockedEvent);
        });

        it('should do nothing if already banned', async () => {
            const user = await createUser();
            user.ban();
            user.popDomainEvents();

            user.ban(); // Call it again
            const domainEvents = user.popDomainEvents();

            expect(user.status).toBe(Status.BANNED);
            expect(domainEvents).toHaveLength(0);
        });
    });

    describe('activate', () => {
        it('should change status to ACTIVE', async () => {
            const user = await createUser();
            user.ban();

            user.activate();

            expect(user.status).toBe(Status.ACTIVE);
        });

        it('should raise a UserActivatedEvent', async () => {
            const user = await createUser();
            user.ban();
            user.popDomainEvents();

            user.activate();
            const domainEvents = user.popDomainEvents();
            const event = domainEvents[0] as UserActivatedEvent;

            expect(event).toBeInstanceOf(UserActivatedEvent);
            expect(event.payload.prevStatus).toBe(Status.BANNED);
        });
    });

    describe('updateProfile', () => {
        it('should update name, surname, and phone', async () => {
            const user = await createUser();
            const newProfileData = {
                name: 'Jane',
                surname: 'Smith',
                phone: '+994557654321',
            };

            user.updateProfile(newProfileData);

            expect(user.name).toBe('Jane');
            expect(user.surname).toBe('Smith');
            expect(user.phone).toBe('+994557654321');
        });

        it('should raise a UserUpdatedEvent', async () => {
            const user = await createUser();
            user.popDomainEvents();

            user.updateProfile({ name: 'Jane', surname: 'Smith', phone: '+994557654321'});
            const domainEvents = user.popDomainEvents();

            expect(domainEvents[0]).toBeInstanceOf(UserUpdatedEvent);
        });
    });
});
import { InMemoryUserRepo } from './inMemoryUserRepo';
import { User } from '../../domain/user';

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'uuid-123')
}));

describe('InMemoryUserRepo', () => {
    let repo: InMemoryUserRepo;
    let users: User[] = [];

    beforeEach(async () => {
        users = [];
        repo = new InMemoryUserRepo(users);
    });

    it('should save a user', async () => {
        const userData: Omit<User, 'id'> = { name: 'John Doe', age: 30, politicalParty: 'Independent' };
        const savedUser = await repo.save(userData);

        expect(savedUser).toHaveProperty('id', 'uuid-123');
        expect(savedUser.name).toBe(userData.name);
        expect(users.length).toBe(1);
        expect(users[0]).toEqual(savedUser);
    });

    it('should find all users', async () => {
        const existingUser: User = { id: '1', name: 'Jane Doe', age: 25, politicalParty: 'Democrat' };
        users.push(existingUser);

        const testRepo = new InMemoryUserRepo(users);
        const allUsers = await testRepo.findAll();

        expect(allUsers).toEqual(users);
        expect(allUsers).not.toBe(users);
    });

    it('should find user by id', async () => {
        const user: User = { id: 'uuid-123', name: 'Alice Smith', age: 28, politicalParty: 'Republican' };
        users.push(user);

        const foundUser = await repo.findById('uuid-123');

        expect(foundUser).toEqual(user);
    });

    it('should return undefined if user not found by id', async () => {
        const foundUser = await repo.findById('non-existent');
        expect(foundUser).toBeUndefined();
    });

    it('should delete a user', async () => {
        const user: User = { id: 'to-delete', name: 'Bob Builder', age: 40, politicalParty: 'Independent' };
        users.push(user);

        await repo.delete('to-delete');

        expect(users.length).toBe(0);
    });

    it('should safely handle delete for non-existent user', async () => {
        const user: User = { id: 'keep-me', name: 'Bob Builder', age: 40, politicalParty: 'Independent' };
        users.push(user);

        await repo.delete('non-existent');

        expect(users.length).toBe(1);
    });
});

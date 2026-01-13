import { UserService } from './userService';
import { UserRepositoryPort } from '../ports/driven/userRepoPort';
import { CircleRepositoryPort } from '../ports/driven/circleRepoPort';
import { User } from '../domain/user';
import { Circle } from '../domain/circle';

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepo: jest.Mocked<UserRepositoryPort>;
    let mockCircleRepo: jest.Mocked<CircleRepositoryPort>;

    beforeEach(() => {
        mockUserRepo = {
            findAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        } as any;

        mockCircleRepo = {
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            findCirclesByUserId: jest.fn(),
        } as any;

        userService = new UserService(mockUserRepo, mockCircleRepo);
    });

    it('should create a user', async () => {
        const user: Omit<User, 'id'> = { firstName: 'John', lastName: 'Doe', age: 30, politicalParty: 'Independent' };
        const createdUser: User = { id: '1', ...user };
        mockUserRepo.save.mockResolvedValue(createdUser);

        const result = await userService.createUser(user);

        expect(mockUserRepo.save).toHaveBeenCalledWith(user);
        expect(result).toEqual(createdUser);
    });

    it('should get a user by id', async () => {
        const user: User = { id: '1', firstName: 'John', lastName: 'Doe', age: 30, politicalParty: 'Independent' };
        mockUserRepo.findById.mockResolvedValue(user);

        const result = await userService.getUser('1');

        expect(mockUserRepo.findById).toHaveBeenCalledWith('1');
        expect(result).toEqual(user);
    });

    it('should return undefined if user not found', async () => {
        mockUserRepo.findById.mockResolvedValue(undefined);

        const result = await userService.getUser('1');

        expect(result).toBeUndefined();
    });

    it('should list users', async () => {
        const users: User[] = [{ id: '1', firstName: 'John', lastName: 'Doe', age: 30, politicalParty: 'Independent' }];
        mockUserRepo.findAll.mockResolvedValue(users);

        const result = await userService.listUsers();

        expect(mockUserRepo.findAll).toHaveBeenCalled();
        expect(result).toEqual(users);
    });

    it('should delete a user', async () => {
        mockUserRepo.delete.mockResolvedValue(undefined);

        await userService.deleteUser('1');

        expect(mockUserRepo.delete).toHaveBeenCalledWith('1');
    });

    it('should get circles for a user', async () => {
        const user: User = { id: '1', firstName: 'John', lastName: 'Doe', age: 30, politicalParty: 'Independent' };
        const circles: Circle[] = [{ id: '1', name: 'Tech', type: 'Work', members: [user] }];

        mockUserRepo.findById.mockResolvedValue(user);
        mockCircleRepo.findCirclesByUserId.mockResolvedValue(circles);

        const result = await userService.getCircles('1');

        expect(mockUserRepo.findById).toHaveBeenCalledWith('1');
        expect(mockCircleRepo.findCirclesByUserId).toHaveBeenCalledWith('1');
        expect(result).toEqual(circles);
    });

    it('should throws error if user not found when getting circles', async () => {
        mockUserRepo.findById.mockResolvedValue(undefined);

        await expect(userService.getCircles('1')).rejects.toThrow("User not found");
        expect(mockCircleRepo.findCirclesByUserId).not.toHaveBeenCalled();
    });
});

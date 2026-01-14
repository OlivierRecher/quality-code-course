import { CircleService } from './circleService';
import { CircleRepositoryPort } from '../ports/driven/circleRepoPort';
import { UserRepositoryPort } from '../ports/driven/userRepoPort';
import { Circle } from '../domain/circle';
import { User } from '../domain/user';

describe('CircleService', () => {
    let circleService: CircleService;
    let mockCircleRepo: jest.Mocked<CircleRepositoryPort>;
    let mockUserRepo: jest.Mocked<UserRepositoryPort>;

    beforeEach(() => {
        mockCircleRepo = {
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            findCirclesByUserId: jest.fn(),
        } as unknown as jest.Mocked<CircleRepositoryPort>;

        mockUserRepo = {
            findAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<UserRepositoryPort>;

        circleService = new CircleService(mockCircleRepo, mockUserRepo);
    });

    it('should create a circle', async () => {
        const circle: Omit<Circle, 'id'> = { name: 'Tech', type: 'Work', members: [] };
        const createdCircle: Circle = { id: '1', ...circle };
        mockCircleRepo.save.mockResolvedValue(createdCircle);

        const result = await circleService.createCircle(circle);

        expect(mockCircleRepo.save).toHaveBeenCalledWith(circle);
        expect(result).toEqual(createdCircle);
    });

    it('should get a circle by id', async () => {
        const circle: Circle = { id: '1', name: 'Tech', type: 'Work', members: [] };
        mockCircleRepo.findById.mockResolvedValue(circle);

        const result = await circleService.getCircle('1');

        expect(mockCircleRepo.findById).toHaveBeenCalledWith('1');
        expect(result).toEqual(circle);
    });

    it('should return undefined if circle not found', async () => {
        mockCircleRepo.findById.mockResolvedValue(undefined);

        const result = await circleService.getCircle('1');

        expect(result).toBeUndefined();
    });

    describe('addMember', () => {
        it('should add a user to a circle', async () => {
            const circle: Circle = { id: '1', name: 'Tech', type: 'Work', members: [] };
            const user: User = { id: '1', firstName: 'John', lastName: 'Doe', age: 30, politicalParty: 'Independent' };

            mockCircleRepo.findById.mockResolvedValue(circle);
            mockUserRepo.findById.mockResolvedValue(user);
            mockCircleRepo.update.mockResolvedValue(undefined);

            await circleService.addMember('1', '1');

            expect(mockCircleRepo.findById).toHaveBeenCalledWith('1');
            expect(mockUserRepo.findById).toHaveBeenCalledWith('1');
            expect(circle.members).toContain(user);
            expect(mockCircleRepo.update).toHaveBeenCalledWith(circle);
        });

        it('should throw error if circle not found', async () => {
            mockCircleRepo.findById.mockResolvedValue(undefined);

            await expect(circleService.addMember('1', '1')).rejects.toThrow('Circle not found');
            expect(mockUserRepo.findById).not.toHaveBeenCalled();
            expect(mockCircleRepo.update).not.toHaveBeenCalled();
        });

        it('should throw error if user not found', async () => {
            const circle: Circle = { id: '1', name: 'Tech', type: 'Work', members: [] };
            mockCircleRepo.findById.mockResolvedValue(circle);
            mockUserRepo.findById.mockResolvedValue(undefined);

            await expect(circleService.addMember('1', '1')).rejects.toThrow('User not found');
            expect(mockCircleRepo.update).not.toHaveBeenCalled();
        });

        it('should not add user if already a member', async () => {
            const user: User = { id: '1', firstName: 'John', lastName: 'Doe', age: 30, politicalParty: 'Independent' };
            const circle: Circle = { id: '1', name: 'Tech', type: 'Work', members: [user] };

            mockCircleRepo.findById.mockResolvedValue(circle);
            mockUserRepo.findById.mockResolvedValue(user);

            await expect(circleService.addMember('1', '1')).rejects.toThrow('User is already a member of the circle');
        });
    });
});

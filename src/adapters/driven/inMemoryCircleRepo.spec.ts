import { InMemoryCircleRepo } from './inMemoryCircleRepo';
import { Circle } from '../../domain/circle';
import { User } from '../../domain/user';

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'uuid-123')
}));

describe('InMemoryCircleRepo', () => {
    let repo: InMemoryCircleRepo;
    let circles: Circle[] = [];

    beforeEach(async () => {
        circles = [];
        repo = new InMemoryCircleRepo(circles);
    });

    it('should save a circle', async () => {
        const circleData: Omit<Circle, 'id'> = { name: 'Developers', type: 'Tech', members: [] };
        const savedCircle = await repo.save(circleData);

        expect(savedCircle).toHaveProperty('id', 'uuid-123');
        expect(savedCircle.name).toBe(circleData.name);
        expect(circles.length).toBe(1);
        expect(circles[0]).toEqual(savedCircle);
    });

    it('should find circle by id', async () => {
        const circle: Circle = { id: 'circle-1', name: 'Designers', type: 'Art', members: [] };
        circles.push(circle);

        const foundCircle = await repo.findById('circle-1');

        expect(foundCircle).toEqual(circle);
    });

    it('should return undefined if circle not found', async () => {
        const foundCircle = await repo.findById('non-existent');
        expect(foundCircle).toBeUndefined();
    });

    it('should update a circle', async () => {
        const circle: Circle = { id: 'circle-1', name: 'Old Name', type: 'Type', members: [] };
        circles.push(circle);

        const updatedCircle: Circle = { ...circle, name: 'New Name' };
        await repo.update(updatedCircle);

        expect(circles[0].name).toBe('New Name');
    });

    it('should find circles by userId', async () => {
        const user1: User = { id: 'u1', name: 'A B', age: 20, politicalParty: 'P' };
        const user2: User = { id: 'u2', name: 'C D', age: 22, politicalParty: 'P' };

        const circle1: Circle = { id: 'c1', name: 'C1', type: 'T', members: [user1] };
        const circle2: Circle = { id: 'c2', name: 'C2', type: 'T', members: [user2] };
        const circle3: Circle = { id: 'c3', name: 'C3', type: 'T', members: [user1, user2] };

        circles.push(circle1, circle2, circle3);

        const user1Circles = await repo.findCirclesByUserId('u1');

        expect(user1Circles.length).toBe(2);
        expect(user1Circles).toContain(circle1);
        expect(user1Circles).toContain(circle3);
        expect(user1Circles).not.toContain(circle2);
    });
});

import request from 'supertest';
import { app } from './app';
import { UserService } from './services/userService';
import { CircleService } from './services/circleService';
import { InMemoryUserRepo } from './adapters/driven/inMemoryUserRepo';
import { InMemoryCircleRepo } from './adapters/driven/inMemoryCircleRepo';

describe('Integration Tests', () => {
    let userService: UserService;
    let circleService: CircleService;
    let userRepo: InMemoryUserRepo;
    let circleRepo: InMemoryCircleRepo;

    beforeEach(() => {
        userRepo = new InMemoryUserRepo();
        circleRepo = new InMemoryCircleRepo();
        userService = new UserService(userRepo, circleRepo);
        circleService = new CircleService(circleRepo, userRepo);
    });

    describe('User Management', () => {
        it('should create a user', async () => {
            const user = await userService.createUser({
                firstName: 'John',
                lastName: 'Doe',
                age: 30,
                politicalParty: 'Independent'
            });

            expect(user).toHaveProperty('id');
            expect(`${user.firstName} ${user.lastName}`).toBe('John Doe');
            expect(user.age).toBe(30);
            expect(user.politicalParty).toBe('Independent');
        });

        it('should retrieve a created user', async () => {
            const createdUser = await userService.createUser({
                firstName: 'Jane',
                lastName: 'Doe',
                age: 25,
                politicalParty: 'Democrat'
            });

            const retrievedUser = await userService.getUser(createdUser.id);

            expect(retrievedUser).toBeDefined();
            expect(retrievedUser?.id).toBe(createdUser.id);
            expect(retrievedUser?.firstName).toBe('Jane');
            expect(retrievedUser?.lastName).toBe('Doe');
            expect(retrievedUser?.age).toBe(25);
            expect(retrievedUser?.politicalParty).toBe('Democrat');
        });

        it('should retrieve all users', async () => {
            const user1 = await userService.createUser({
                firstName: 'User',
                lastName: 'One',
                age: 20,
                politicalParty: 'Party A'
            });
            const user2 = await userService.createUser({
                firstName: 'User',
                lastName: 'Two',
                age: 22,
                politicalParty: 'Party B'
            });

            const users = await userService.listUsers();

            expect(users).toHaveLength(2);
            expect(users.map(u => u.id)).toContain(user1.id);
            expect(users.map(u => u.id)).toContain(user2.id);
        });

        it('should delete a user', async () => {
            const user = await userService.createUser({
                firstName: 'To',
                lastName: 'Delete',
                age: 40,
                politicalParty: 'Independent'
            });

            await userService.deleteUser(user.id);

            const deletedUser = await userService.getUser(user.id);
            expect(deletedUser).toBeUndefined();
        });
    });

    describe('Circle Management', () => {
        it('should create a circle', async () => {
            const circle = await circleService.createCircle({
                type: 'Social',
                members: [],
                name: 'My Circle'
            });

            expect(circle).toHaveProperty('id');
            expect(circle.name).toBe('My Circle');
            expect(circle.type).toBe('Social');
            expect(circle.members).toHaveLength(0);
        });

        it('should retrieve a created circle', async () => {
            const createdCircle = await circleService.createCircle({
                type: 'Professional',
                members: [],
                name: 'Work Circle'
            });

            const retrievedCircle = await circleService.getCircle(createdCircle.id);

            expect(retrievedCircle).toBeDefined();
            expect(retrievedCircle?.id).toBe(createdCircle.id);
            expect(retrievedCircle?.name).toBe('Work Circle');
            expect(retrievedCircle?.type).toBe('Professional');
            expect(retrievedCircle?.members).toHaveLength(0);
        });
    });

    describe('Circle and User Integration', () => {
        it('should allow a user to join a circle', async () => {
            const user = await userService.createUser({
                firstName: 'Alice',
                lastName: 'Smith',
                age: 28,
                politicalParty: 'Republican'
            });

            const circle = await circleService.createCircle({
                type: 'Hobby',
                members: [],
                name: 'Book Club'
            });

            await circleService.addMember(circle.id, user.id);

            const updatedCircle = await circleService.getCircle(circle.id);

            expect(updatedCircle).toBeDefined();
            expect(updatedCircle?.members).toHaveLength(1);
            expect(updatedCircle?.members[0].id).toBe(user.id);
        });

        it('should retrieve circles for a user', async () => {
            const user = await userService.createUser({
                firstName: 'Bob',
                lastName: 'Brown',
                age: 35,
                politicalParty: 'Libertarian'
            });

            const circle1 = await circleService.createCircle({
                type: 'Sports',
                members: [],
                name: 'Football Fans'
            });

            const circle2 = await circleService.createCircle({
                type: 'Music',
                members: [],
                name: 'Rock Lovers'
            });

            await circleService.addMember(circle1.id, user.id);
            await circleService.addMember(circle2.id, user.id);

            const userCircles = await userService.getCircles(user.id);

            expect(userCircles).toHaveLength(2);
            const circleNames = userCircles.map(c => c.name);
            expect(circleNames).toContain('Football Fans');
            expect(circleNames).toContain('Rock Lovers');
        });

        it('should not allow adding the same user to a circle twice', async () => {
            const user = await userService.createUser({
                firstName: 'Charlie',
                lastName: 'Davis',
                age: 29,
                politicalParty: 'Green'
            });

            const circle = await circleService.createCircle({
                type: 'Gaming',
                members: [],
                name: 'Gamers Unite'
            });

            await circleService.addMember(circle.id, user.id);

            await expect(circleService.addMember(circle.id, user.id)).rejects.toThrow('User is already a member of the circle');
        });
    });
});

describe('E2E Tests', () => {
    it('should create a user', async () => {
        const response = await request(app)
            .post('/users')
            .send({ name: 'John Doe', email: 'john@example.com' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('John Doe');
        expect(response.body.email).toBe('john@example.com');
    });

    it('should retrieve a created user', async () => {
        const createResponse = await request(app)
            .post('/users')
            .send({ name: 'Jane Doe', email: 'jane@example.com' });

        const userId = createResponse.body.id;

        const getResponse = await request(app)
            .get(`/users/${userId}`);

        expect(getResponse.status).toBe(200);
        expect(getResponse.body.id).toBe(userId);
        expect(getResponse.body.name).toBe('Jane Doe');
    });

    it('should create a circle', async () => {
        const response = await request(app)
            .post('/circles')
            .send({ name: 'My Circle' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('My Circle');
    });

    it('should allow a user to join a circle', async () => {
        const userRes = await request(app)
            .post('/users')
            .send({ name: 'Alice', email: 'alice@example.com' });
        const userId = userRes.body.id;

        const circleRes = await request(app)
            .post('/circles')
            .send({ name: 'Readers Club' });
        const circleId = circleRes.body.id;

        const joinRes = await request(app)
            .put(`/circles/${circleId}/users/${userId}`)
            .send();

        expect(joinRes.status).toBe(204);
    });
});

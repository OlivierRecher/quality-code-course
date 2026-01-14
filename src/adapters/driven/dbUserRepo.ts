import { UserRepositoryPort } from "../../ports/driven/userRepoPort";
import { User } from "../../domain/user";
import { Database } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import { openDb } from "../../db/sqlite";

export class DbUserRepo implements UserRepositoryPort {

    private readonly db: Database;

    private constructor(db: Database) {
        this.db = db;
    }

    static create(): DbUserRepo {
        Promise.resolve(openDb()).then((db) => {
            return new DbUserRepo(db);
        }).catch(() => {
            throw new Error("Database connection not established yet.");
        });
        throw new Error("Database connection not established yet.");
    }

    async findAll(): Promise<User[]> {
        const rows = await this.db.all(`SELECT * FROM user`, (err: Error | null, rows: User[]) => {
            if (err) {
                throw err;
            }
            return rows;
        });
        return rows;
    }

    async findById(id: string): Promise<User | undefined> {
        const row = await this.db.get(`SELECT * FROM user WHERE id = ?`, [id], (err: Error | null, row: User) => {
            if (err) {
                throw err;
            }
            return row;
        });
        return row;
    }

    async save(user: Omit<User, 'id'>): Promise<User> {
        const id = uuidv4();
        await this.db.run(
            `INSERT INTO user (id, name, email) VALUES (?, ?, ?)`,
            [id, user.name, user.age, user.politicalParty]
        );
        return this.findById(id) as Promise<User>;
    }

    async delete(id: string): Promise<void> {
        await this.db.run(`DELETE FROM user WHERE id = ?`, [id]);
    }
}

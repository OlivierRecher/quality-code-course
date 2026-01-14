import { UserRepositoryPort } from "../../ports/driven/userRepoPort";
import { User } from "../../domain/user";
import { openDb } from '../../db/sqlite';
import { Database } from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

export class DbUserRepo implements UserRepositoryPort {

    private db: Database;

    private constructor(db: Database) {
        this.db = db;
    }

    static create(db: Database): DbUserRepo {
        return new DbUserRepo(db);
    }

    async findAll(): Promise<User[]> {
        const rows = await new Promise<User[]>((resolve, reject) => {
            this.db.all(`SELECT * FROM user`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as User[]);
                }
            });
        });
        return rows.map(row => ({
            id: row.id,
            firstName: row.firstName,
            lastName: row.lastName,
            age: row.age,
            politicalParty: row.politicalParty
        }));
    }

    async findById(id: string): Promise<User | undefined> {
        const row = await new Promise<User | undefined>((resolve, reject) => {
            this.db.get(`SELECT * FROM user WHERE id = ?`, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row as User | undefined);
                }
            });
        });
        if (!row) {
            return undefined;
        }
        return {
            id: row.id,
            firstName: row.firstName,
            lastName: row.lastName,
            age: row.age,
            politicalParty: row.politicalParty
        };
    }

    async save(user: Omit<User, 'id'>): Promise<User> {
        const id = uuidv4();
        await new Promise<void>((resolve, reject) => {
            this.db.run(
                `INSERT INTO user (id, firstName, lastName, age, politicalParty) VALUES (?, ?, ?, ?, ?)`,
                [id, user.firstName, user.lastName, user.age, user.politicalParty],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
        return {
            id,
            ...user
        };
    }

    async delete(id: string): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.db.run(`DELETE FROM user WHERE id = ?`, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

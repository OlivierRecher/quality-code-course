import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'node:path';

let db: Database | undefined;

export const openDb = async (): Promise<Database> => {
    if (db) {
        return db;
    }

    const dbFilename = process.env.DB_FILENAME || path.resolve(__dirname, '../../data/database.sqlite');

    db = await open({
        filename: dbFilename,
        driver: sqlite3.Database
    });

    return db;
};

export const initDb = async (): Promise<void> => {
    const database = await openDb();

    await database.exec(`
        CREATE TABLE IF NOT EXISTS user (
            id TEXT PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            age INTEGER NOT NULL,
            politicalParty TEXT NOT NULL
        );
    `);

    await database.exec(`
        CREATE TABLE IF NOT EXISTS circle (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL
        );
    `);

    await database.exec(`
        CREATE TABLE IF NOT EXISTS user_circle (
            user_id TEXT NOT NULL,
            circle_id TEXT NOT NULL,
            PRIMARY KEY (user_id, circle_id),
            FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
            FOREIGN KEY (circle_id) REFERENCES circle(id) ON DELETE CASCADE
        );
    `);

    // eslint-disable-next-line no-console
    console.log('SQLite database initialized');
};

import { initDb } from "../db/sqlite";

// eslint-disable-next-line no-console
console.log("Initializing database...");

initDb()
    .then(() => {
        // eslint-disable-next-line no-console
        console.log("Database initialized successfully.");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error initializing database:", err);
        process.exit(1);
    });

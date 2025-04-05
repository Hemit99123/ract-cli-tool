import { createClient } from "redis";
import pg from "pg";
import chalk from "chalk";
import { readCredentials } from "../utils/manageJSONRecord.js";

export let redisClient = null;
export let sqlDbConnection = null;

const { Client } = pg

export async function connectToServices() {
    const creditionals = await readCredentials();
    const redisUrl = creditionals.redisUrl;
    const sqlDbUrl = creditionals.sqlDbUrl;

    try {
        redisClient = createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 3) {
                        return new Error('Max retries reached');
                    }
                    return Math.min(retries * 100, 3000);
                }
            }
        });

        redisClient.on('error', (err) => {
            console.error(chalk.red('Redis Client Error:'), err);
        });

        await redisClient.connect();
        console.log(chalk.green('✅ Connected to Redis.'));

        sqlDbConnection = new Client({ connectionString: sqlDbUrl });
        await sqlDbConnection.connect();
        console.log(chalk.green('✅ Connected to PostgreSQL.'));
    } catch (error) {
        console.error(chalk.red('❌ Failed to connect to Redis or PostgreSQL:'), error);
        process.exit(1);
    }
}
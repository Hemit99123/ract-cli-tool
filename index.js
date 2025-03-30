import fs from "fs/promises";
import path from "path";
import inquirer from "inquirer";
import { createClient } from "redis";
import pg from "pg";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import figlet from "figlet";

const FILE_PATH = path.join(process.cwd(), 'creditionals.json');
const { Client } = pg;

let redisClient = null;
let sqlDbConnection = null;
let programStatus = true;

async function readCredentials() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log(chalk.yellow('⚠️  Credentials file not found or incomplete.'));
        return null;
    }
}

async function saveCredentials(creditionals) {
    try {
        await fs.writeFile(FILE_PATH, JSON.stringify(creditionals, null, 2));
        console.log(chalk.green('✅ Credentials saved successfully.'));
    } catch (error) {
        console.error(chalk.red('❌ Failed to save credentials.'), error);
    }
}

async function promptForCredentials() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'redisUrl',
            message: chalk.blue('🔗 Enter your Redis URL:'),
        },
        {
            type: 'input',
            name: 'sqlDbUrl',
            message: chalk.magenta('🗄️  Enter your PostgreSQL Database URL:'),
        },
    ]);
    return answers;
}

async function connectToServices() {
    const creditionals = await readCredentials()
    const redisUrl = creditionals.redisUrl
    const sqlDbUrl = creditionals.sqlDbUrl

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

async function welcome() {
    return new Promise((resolve, reject) => {
        figlet('RACT', (err, data) => {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                reject(err);
                return;
            }

            console.log(chalk.blue(data));
            console.log(chalk.cyanBright('Let\'s get started!'));
            console.log();
            console.log();
            resolve();
        });
    });
}

async function updateRole(email) {
    const spinner = createSpinner();

    try {
        const sessions = await redisClient.keys(`${email}:*`);
        const amountOfKeys = sessions.length;

        if (amountOfKeys > 0) {
            await redisClient.del(...sessions);
            console.log(chalk.green(`🗑️ Deleted ${amountOfKeys} keys with email ${email}`));
        } else {
            console.log(chalk.yellow('🚫 No keys found with the given email.'));
        }

        const result = await sqlDbConnection.query('SELECT * FROM "user" WHERE email = $1', [email]);

        const prompter = await inquirer.prompt({
            type: "list",
            name: "role",
            choices: ["User", "Admin"]
        });

        if (result.rows.length > 0) {
            spinner.success({ text: chalk.green(`Email found in PostgreSQL: ${email}`) });
        } else {
            spinner.error({ text: chalk.red('Email not found in either Redis or PostgreSQL.') });
            return;
        }

        const loadingSpinner = createSpinner('Updating role in db...').start();

        if (prompter.role === "User") {
            await sqlDbConnection.query(
                'UPDATE "user" SET role = $1 WHERE email = $2',
                ['User', email]
            );
        } else {
            await sqlDbConnection.query(
                'UPDATE "user" SET role = $1 WHERE email = $2 ',
                ['Admin', email]
            );
        }

        loadingSpinner.stop();
        console.log(chalk.green(`✅ Role for ${email} updated successfully.`));
    } catch (error) {
        console.log(chalk.red(error));
    }
}

async function main() {
    const commandPrompter = await inquirer.prompt([
        {
            type: 'list',
            name: 'command',
            message: chalk.blue('What would you like to do?'),
            choices: ['add/update configs', 'update role', 'exit'],
        },
    ]);

    const { command } = commandPrompter;

    switch (command) {
        case 'add/update configs': {
            const answers = await promptForCredentials();
            await saveCredentials(answers);
            break;
        }
        case 'update role': {
            await connectToServices();

            const emailPrompter = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'email',
                    message: chalk.blue("📧 Enter user's email"),
                },
            ]);
            await updateRole(emailPrompter.email);
            break;
        }
        case 'exit': {
            console.log(chalk.red("🛠️ Exiting tool..."));
            programStatus = false;
            break;
        }
        default:
            console.log(chalk.red('Invalid command.'));
            break;
    }
}

async function run() {
    try {
        await welcome();

        while (programStatus) {
            await main();
        }

        console.log(chalk.green('✅ Exited gracefully.'));
    } catch (error) {
        console.error(chalk.red('Error:', error));
    }
}

run();

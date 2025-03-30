import chalk from "chalk";
import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import { redisClient, sqlDbConnection } from "../services/connect.js";

export async function updateRole(email) {
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
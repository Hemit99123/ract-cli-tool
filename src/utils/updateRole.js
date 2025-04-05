import chalk from "chalk";
import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import { redisClient } from "../services/connect.js";

export async function updateRole(email) {
    const spinner = createSpinner();

    try {
        const sessions = await redisClient.keys(`${email}:*`);
        const amountOfKeys = sessions.length;

        if (amountOfKeys > 0) {
            await redisClient.del(...sessions);
            console.log(chalk.green(`🗑️ Deleted ${amountOfKeys} session keys for ${email}`));
        } else {
            console.log(chalk.yellow('🚫 No session keys found with the given email.'));
        }

        // Query user using RediSearch
        const searchResult = await redisClient.ft.search('idx:user', `@email:{${email}}`);

        if (searchResult.total === 0) {
            spinner.error({ text: chalk.red('Email not found in Redis index.') });
            return;
        } else {
            spinner.success({ text: chalk.green(`Email found in Redis: ${email}`) });
        }

        const userDoc = searchResult.documents[0];
        const userId = userDoc.id; // This should be like "user:123"

        const prompter = await inquirer.prompt({
            type: "list",
            name: "role",
            choices: ["User", "Admin"]
        });

        const loadingSpinner = createSpinner('Updating role in Redis...').start();

        await redisClient.hset(userId, {
            role: prompter.role
        });

        loadingSpinner.stop();
        console.log(chalk.green(`✅ Role for ${email} updated successfully to ${prompter.role}.`));

    } catch (error) {
        console.log(chalk.red(error));
    }
}

import inquirer from "inquirer";
import chalk from "chalk";

export async function promptForCredentials() {
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
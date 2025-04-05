import inquirer from "inquirer";
import chalk from "chalk";

export async function prompterForUsername() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: chalk.blue("📧 Enter username:")
        },
    ]);
    return answers;
}
import inquirer from "inquirer";
import chalk from "chalk";

export async function promptForEmail() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'email',
            message: chalk.blue("📧 Enter user's email")
        },
    ]);
    return answers;
}
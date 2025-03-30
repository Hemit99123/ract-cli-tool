import inquirer from "inquirer";
import chalk from "chalk";

export async function promptForCommand() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'command',
            message: chalk.blue('What would you like to do?'),
            choices: ['add/update configs', 'update role'],
        },
    ]);
    return answers;
}
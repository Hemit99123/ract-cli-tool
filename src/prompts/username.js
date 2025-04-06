import inquirer from "inquirer";
import chalk from "chalk";
import { handleTimeOut } from "../utils/timeout.js";

export async function prompterForUsername() {
    try {
        const answers = await Promise.race([
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'username',
                    message: chalk.blue("📧 Enter username:"),
                },
            ]),
            handleTimeOut()  // Add the timeout race
        ]);
        
        return answers;
    } catch (error) {
        console.log(chalk.red(error.message)); // Log the timeout error message
        process.exit(1); // Exit the process on timeout
    }
}
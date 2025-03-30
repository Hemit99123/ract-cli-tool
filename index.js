import { readCredentials, saveCredentials } from "./src/services/credentials.js";
import { connectToServices } from "./src/services/connect.js";
import { promptForCredentials } from "./src/prompts/credentials.js";
import { promptForCommand } from "./src/prompts/command.js";
import { promptForEmail } from "./src/prompts/email.js";
import { welcome } from "./src/utils/welcome.js";
import { updateRole } from "./src/utils/updateRole.js";
import chalk from "chalk";

let programStatus = true;

async function main() {
    const { command } = await promptForCommand();

    switch (command) {
        case 'add/update configs': {
            const answers = await promptForCredentials();
            await saveCredentials(answers);
            break;
        }
        case 'update role': {
            await connectToServices();

            const { email } = await promptForEmail();
            await updateRole(email);
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
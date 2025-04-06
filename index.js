#!/usr/bin/env node

import { connectToServices } from "./src/services/connect.js";
import { promptForCredentials } from "./src/prompts/credentials.js";
import { promptForCommand } from "./src/prompts/command.js";
import { prompterForUsername } from "./src/prompts/username.js";
import { welcome } from "./src/utils/welcome.js";
import { updateRole } from "./src/utils/updateRole.js";
import { saveCredentials } from "./src/utils/manageJSONRecord.js";
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

            const { username } = await prompterForUsername();
            await updateRole(username);
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
    } catch (error) {
        console.error(chalk.red('Error:', error));
    }
}

run();
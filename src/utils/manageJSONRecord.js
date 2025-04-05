import fs from "fs/promises";
import path from "path";
import chalk from "chalk";

const FILE_PATH = path.join(process.cwd(), 'creditionals.json');

export async function readCredentials() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log(chalk.yellow('⚠️  Credentials file not found or incomplete.'));
        return null;
    }
}

export async function saveCredentials(creditionals) {
    try {
        await fs.writeFile(FILE_PATH, JSON.stringify(creditionals, null, 2));
        console.log(chalk.green('✅ Credentials saved successfully.'));
    } catch (error) {
        console.error(chalk.red('❌ Failed to save credentials.'), error);
    }
}
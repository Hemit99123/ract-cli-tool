import chalk from "chalk";
import inquirer from "inquirer";
import { redisClient, sqlDbConnection } from "../services/connect.js";

export async function updateRole(username) {
    try {

        // Query RedisJSON using RediSearch
        const searchResult = await redisClient.ft.search(
            "idx:session", 
            username
        );

        const collectionOfSessions = searchResult.documents
        const collectionLength = collectionOfSessions.length

        // Go through eacb queried key and destroy it, destroying all sessions belonging to username

        if (collectionLength !== 0) {

            collectionOfSessions.forEach(async session => {
                await redisClient.del(session.id)
            })
    
            console.log(chalk.green("Successfully deleted sessions 🗑️"))
        } else {
            console.log(chalk.yellow("No sessions to delete"))
        }


        const prompter = await inquirer.prompt({
            type: "list",
            name: "role",
            choices: ["User", "Admin"],
        });

        await sqlDbConnection.query(
            'UPDATE "user" SET role = $1 WHERE name =$2',
            [prompter.role, username]
        )
        
    } catch (error) {
        console.log(chalk.red("❌ Error:"), error);
    }
}

import figlet from "figlet";
import chalk from "chalk";

export async function welcome() {
    return new Promise((resolve, reject) => {
        figlet('RACT', (err, data) => {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                reject(err);
                return;
            }

            console.log(chalk.blue(data));
            console.log(chalk.cyanBright('Let\'s get started!'));
            resolve();
        });
    });
}
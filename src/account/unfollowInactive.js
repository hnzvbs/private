const { chalk, inquirer, _, fs, instagram, print, delay } = require("./../api.js");
require('dotenv').config();

(async () => {
    print(
        chalk`{bold.green
  Unfollow people if they haven't active for 90 days\n}`);

    const questions = [
        {
            type: "input",
            name: "perExec",
            message: "Input limit per-execution [1-5]:",
            validate: (val) => /[0-9]/.test(val) || "Only input numbers",
        },        
    ];
    
    try {
        const { perExec } = await inquirer.prompt(questions);
        
        // Login Information
        const username = process.env.IG_USERNAME;
        const password = process.env.IG_PASSWORD;
        
        // Auto Change Delay
        function getRandomDelay() {
            const minDelay = 600000; // Minimum Delay
            const maxDelay = 1000000; // Maximum Delay
            return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        }
        
        // Try to Login
        const ig = new instagram(username, password);
        print("Try to Login . . .", "wait", true);
        const login = await ig.login(),
            info = await ig.userInfo(login.pk);
        print(`Logged in as @${login.username} (ID : ${login.pk})`, "ok");
        
        // Collecting followed users
        print(`Collecting followed users . . .`, "wait");
        const following = await ig.followingFeed();

        // Show total following 
        print(`You're following ${info.following_count} users !`, "ok");
        
        // Logs
        const log = fs.createWriteStream("./logs/accounts/unfollow.txt", { flags: "a" });
        
        // Doing Tasks
        print(`You will unfollow ${perExec} users per-execution`, "ok");
        print(`All logs will be stored here /logs/account/unfollow.txt \n`, "ok");
        do {
            let items = await following.items();
            items = _.chunk(items, perExec);
            for (let i = 0; i < items.length; i++) {
                const activityThreshold = 90; // Number of days
                await Promise.all(
                items[i].map(async (user) => {
                // Check if the user has been active recently
                const userInfo = await ig.userInfo(user.pk);
                const lastActivity = userInfo.last_activity_at;
                const daysSinceLastActivity = (Date.now() - lastActivity) / (1000 * 60 * 60 * 24);
                if (daysSinceLastActivity > activityThreshold) {
                print(`• @${user.username} : ${chalk.bold.red("Unfollowed, inactive.")}`);
                log.write(`${new Date().toString()} - Unfollowed @${user.username} - Inactive\n`);
                await ig.unfollow(user.pk);
                return;
                }
                print(`• @${user.username} : ${chalk.bold.green("Skipped, active.")}`);
                log.write(`${new Date().toString()} - Skipped @${user.username} - Active\n`);
                })
                );
                
                // Sleeping
                if (i < items.length - 1) print(`[@${login.username}] Sleeping for ${getRandomDelay()}ms.... \n`, "wait", true);
                await delay(getRandomDelay());
                }
                }
                while (following.moreAvailable);
                print(`All Tasks done!`, "ok", true);
                log.end();
                } catch (err) {
                print(err, "err");
                }
                })();

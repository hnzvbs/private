const { chalk, inquirer, print } = require("./src/api.js");
var moment = require("moment");
var colors = require("colors");
var userHome = require("user-home");
var open = require('open');
var os = require("os");

// List
const questionTools = [
    "- Information",
    "- Unfollow user if they haven't any post [BETA]",
    "- Unfollow Inactive user [BETA]",
    "- View all story from Followers ( Not stable yet, maybe spammy )",
    "- View all story from Following ( Not stable yet, maybe spammy )",
    "- View all story from Following ( More stable )",
    "\n",
];

// SELECTOR
const menuQuestion = {
    type: "list",
    name: "choice",
    message: "> Select tools :",
    choices: questionTools,
};

// Tools List
const main = async () => {
    try {
        const { choice } = await inquirer.prompt(menuQuestion);
        choice == questionTools[0] && require("./src/info.js");
        choice == questionTools[1] && require("./src/account/unfollowNoPost.js");
        choice == questionTools[2] && require("./src/account/unfollowInactive.js");
        choice == questionTools[3] && require("./src/igStories/stories1.js");
        choice == questionTools[4] && require("./src/igStories/stories2.js");
        choice == questionTools[5] && require("./src/igStories/stories3.js");
        choice == questionTools[6] && process.exit();
    } catch (err) {
        print(err, "err");
    }
};

console.log(chalk`{bold.green 

  ██╗███╗░░██╗░██████╗████████╗░█████╗░░░░░░██╗░██████╗
  ██║████╗░██║██╔════╝╚══██╔══╝██╔══██╗░░░░░██║██╔════╝
  ██║██╔██╗██║╚█████╗░░░░██║░░░███████║░░░░░██║╚█████╗░
  ██║██║╚████║░╚═══██╗░░░██║░░░██╔══██║██╗░░██║░╚═══██╗
  ██║██║░╚███║██████╔╝░░░██║░░░██║░░██║╚█████╔╝██████╔╝
  ╚═╝╚═╝░░╚══╝╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝░╚════╝░╚═════╝░ 

  - https://instagram.com/hanzvibes

  Last update : 19 January 2023}\n`);
console.log("  Thanks for your donation :) \n".bold.green);
console.log(chalk`{bold   Edit .env file to input your account}\n`)

main();
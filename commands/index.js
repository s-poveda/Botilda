const 
    fs = require('node:fs')
    commandFiles = fs
        .readdirSync("./commands")
        .filter((file) => file.endsWith(".js"));

module.exports = {
  register_slash_commands: () => {},
};

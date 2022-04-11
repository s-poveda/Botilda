const 
    fs = require('node:fs')
    commandFiles = fs
        .readdirSync(__dirname)
        .filter((file) => file.endsWith(".c.js"));

module.exports = {
  register_slash_commands: () => {
      
  },
};

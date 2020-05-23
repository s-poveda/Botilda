const Discord = require('discord.js');
const client = new Discord.Client();
const {token} = require('./auth.json');
const prefix = '-';
const Character = require('./characters/');
// const fs = require('fs');
// const storeData = (data, path) => {
//  try {
//    fs.writeFileSync(path, JSON.stringify(data))
//  } catch (err) {
//    console.error(err)
//  }
// }
//const loadData = (path) => {
//    fs.readFileSync(path, (err, data) => {
//      if (err) throw err;
//      console.log(data);
//    })
//  }

let numberOfPlayers;
let responses = [];
let players = [];

// let thing = JSON.parse(fs.readFileSync('auth.json', callback));
// console.log(thing);
//  function callback (err) {
//   console.log('noice!\n');
// }

client.login(token);
console.log('Matilda got out of bed!');

client.once('ready', () => {

  console.log("And she's hard at work!");
});

function getRoleId (message, roleToFind) {
  //returns name of the desired ID as a string.
  const role = message.guild.roles.cache.find(role => {
    return role.name.toLowerCase() == roleToFind.toLowerCase();
  });
  return role.id;
}

client.on('message', message => {
  const discordId = message.author.id;
  if (message.content.startsWith(prefix) ) {
    //takes full message string and makes array with the words
    const cmds = message.content.toLowerCase().substr(1).split(' ');
    switch (cmds[0]) {

      case 'open':
        if (message.member.roles.cache.some(role=>role.name.toLowerCase() == ('artificer')) ||
          message.member.roles.cache.some(role=>role.name.toLowerCase() == ('the dm')) ) {
            numberOfPlayers = parseInt(cmds[1]);
            console.log(`the party is now of ${numberOfPlayers} of type ${typeof numberOfPlayers}`);
            message.reply(`The number of players is ${numberOfPlayers}\n <@&${getRoleId(message, 'the party')}> type "-newCharacter [name of your character]" to begin!`);
        }
        break;

      case 'start':
        if (!players.some((player) => player.userId == discordId) && message.member.roles.cache.some(role=>role.name.toLowerCase() == ('the party')) ) {
          let newPlayer = new Character(cmds[1], discordId)
          players.push(newPlayer);
          console.log(`<@${discordId}> to the active players`);
          console.log(players);
          message.channel.send(`<@${discordId}> you've been added to the active players`);
        } else {
          message.channel.send(`<@${discordId}> you have been added to the active party already.`);
        }
        break;

      case 'info':
      let roleToFind = '';
      for(let i = 1; i < cmds.length; i++) {roleToFind += `${cmds[i]} `;}
      roleToFind = roleToFind.trim();
      console.log(roleToFind);
      console.log(getRoleId(message, roleToFind));
      console.log(discordId);
      console.log(players);
      players.forEach( player => {
        if (player.userId == discordId) {
          console.log(`info found:`);
          console.log(player);
        }
      });
        break;

      case 'roll':
      //if DM asks for roll but no # of players is not over 0, asks for input
      //else asks the party to roll
        if (message.member.roles.cache.some(role=>role.name.toLowerCase() == ('the dm')) ) {
          if (!numberOfPlayers > 0) {
            message.channel.send(`There don't appear to be any party members at the moment.\nPlease add them using "-players [number of players]".`)
          } else {
            responses = [];
            message.channel.send(`<@&${getRoleId(message, 'the party')}> Roll for ${cmds[1]}!`);
          }
        }
        if (message.member.roles.cache.some(role=>role.name.toLowerCase() == ('the party')) ) {
          if (!responses.some((player) => player.userId == discordId) ) {
            let player = players.find((player) => {return player.userId == discordId});
                player.roll = cmds[1];
                responses.push(player);
                console.log(responses);
          }
        }

          if (responses.length >= numberOfPlayers) {
              message.channel.send(`<@&${getRoleId(message, 'the dm')}> all players have submitted their rolls!`);
              for (let i = 0; i < players.length; i++) {
                let player = players[i];
                message.channel.send(`${player.name}  --------- **${player.roll}**`);
              }
              responses = [];
          }

        break;

      case 'help':
      message.channel.send(
`Dungeon Master:
To begin, type "-open [number of party members]"

To request a check, type "-roll [name of the check]"
---------------------------------------------
Party Members:
Once the DM has opened a party, type "-start [Name of your character]"

Once the DM asks for a roll, submit your roll by typing "-roll [your total for the roll]"`);
      break;

    case 'clear':
    responses = [];
    message.channel.send(`Responses have been reset!`);
    }
  }
});

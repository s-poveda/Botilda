const Discord = require('discord.js');
const client = new Discord.Client();
const {token} = require('./auth.json');
const prefix = '-';
const separator = / & /;
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

let numberOfPlayers = 0;
let responses = [];
let players = [];

// let thing = JSON.parse(fs.readFileSync('auth.json', callback));
// console.log(thing);
//  function callback (err) {
//   console.log('noice!\n');
// }

// let as = new Character('test', 123);
// as.addItem('bow','a bow')
// as.addItem('bow2','another bow')
// console.log(as);


client.login(token);
console.log('Matilda got out of bed!');

client.once('ready', () => {

  console.log("And she's hard at work!");
});

console.createCollapsable = (about, content) => {
  console.groupCollapsed(about);
    console.log(`--------------------Start of ${about}-----------------------`);
    console.log(content);
    console.log(`--------------------End of ${about}-----------------------`);
  console.groupEnd();
};

function getRoleId (message, roleToFind) {
  //returns name of the desired ID as a string.
  const role = message.guild.roles.cache.find(role => {
    return role.name.toLowerCase() == roleToFind.toLowerCase();
  });
  if (typeof role === 'undefined') return 'no role matches';
  return role.id;
}

client.on('message', message => {

  const discordId = message.author.id;
  if (message.content.startsWith(prefix) ) {

    //if character hasn't been made, returns undefined.
    let currentCharacter = players.find( char => {return char.userId == discordId});

    //takes full message string and makes array with the words
    const cmds = message.content.toLowerCase().substr(1).split(' ');
    switch (cmds[0]) {

      case 'open':
        if (message.member.roles.cache.some(role=>role.name.toLowerCase() == ('artificer')) ||
          message.member.roles.cache.some(role=>role.name.toLowerCase() == ('the dm')) ) {
            numberOfPlayers = parseInt(cmds[1]);
            console.log(`the party is now of ${numberOfPlayers} of type ${typeof numberOfPlayers}`);
            message.reply(`The number of players is ${numberOfPlayers}\n <@&${getRoleId(message, 'the party')}> type "-newhar [name of your character]" to begin!`);
        }
        break;

      case 'newchar':
        if (!players.some((player) => player.userId == discordId) && message.member.roles.cache.some(role=>role.name.toLowerCase() == ('the party')) ) {
          let newPlayer = new Character(cmds[1], discordId);
          players.push(newPlayer);
          console.log(`<@${discordId}> added to the active players`);
          console.log(players);
          message.channel.send(`<@${discordId}> you've been added to the active players`);
        } else {
          message.channel.send(`<@${discordId}> you have been added to the active party already.`);
        }
        break;

      case 'info':
      try {
        cmds.shift();
        var roleToFind = cmds.reduce((roleName, word) => { roleName = `${roleName} ${word} `; return roleName.trim(); });
        console.log(`"${roleToFind}" ID: ${getRoleId(message, roleToFind)}`);
      }
      catch (err){
        console.log(`no role to find was requested.`);
      }
      console.log(`your discord ID: ${discordId}.`);
      console.log(`players:\n${players}.`);
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

            try {
              currentCharacter.roll = cmds[1];
              responses.push(currentCharacter);
              console.createCollapsable(`Responses`, responses);

              if (responses.length >= numberOfPlayers) {
                message.channel.send(`<@&${getRoleId(message, 'the dm')}> all players have submitted their rolls!`);
                const fullMessage = players.reduce((fullMessage, player) => {
                  return fullMessage +`${player.name}  --------- **${player.roll}**\n`;
                },'');
                message.channel.send(fullMessage);
                responses = [];
              }
            }
            catch (err) {
              message.channel.send(`<@${message.author.id}> You have not created a character. Please type "-newchar [name of your character]"`);
            }
        }


        break;

      case 'help':
      message.channel.send(
`Dungeon Master:
To begin, type "-open [number of party members]"

To request a check, type "-roll [name of the check]"
---------------------------------------------
Party Members:
Add items to your inventory by typing "-additem [name of your item] + [description]" (WIP)
Remove items from your inventory (WIP)

Once the DM has opened a party, type "-newchar [Name of your character]"
Once the DM asks for a roll, submit your roll by typing "-roll [your total for the roll]"`);
      break;

    case 'clear':
      responses = [];
      message.channel.send(`Responses have been reset!`);
      break;

    case 'send':
    //makes bot send the message
      cmds.shift();
      message.channel.send(`${cmds.reduce((a,b) => {a=`${a} ${b} `; return a.trim(); }) }`);
      break;

    case 'additem':

    //deletes '-additem' and the space following from the contents of the message
      message.content = message.content.substring(cmds[0].length + 2);

      if (players.some( character => { return character.userId == discordId})) {

        //makes array with index 0 (name): anything before separator
        //                 index 1 (description): anything after separator
        let nameAndDesc = message.content.split(separator);

        nameAndDesc = nameAndDesc.map( phrase => {return phrase.trim();});
        currentCharacter.addItem(nameAndDesc[0], nameAndDesc[1]);

        console.createCollapsable(`${currentCharacter.name}`, currentCharacter);
        message.channel.send(`"${nameAndDesc[0]}" has been added to your inventory!`);
      }
      else {
        console.log( message.author);
        message.channel.send(`No character found for you. Have you made one using "-newchar [character name]"?`);
      }
    break;

    case 'inventory':
      const inventoryResponse = currentCharacter.items.reduce((fullMessage, item) => {
        return fullMessage +
`**${item.name}**
${item.description}
=============================================\n`},'');
      message.channel.send(inventoryResponse);

      // TODO: remove items. add removeItems method to character class
    }
  }
});

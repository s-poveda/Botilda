const Discord = require('discord.js');
const client = new Discord.Client();
const { token } = require('./auth.json');
const prefix = '-';
const { noCharacterFoundMessage, helpMessage, newCharacterCreatedMessage, partyOfZeroMessage } = require('./messages.json');
const itemSeparator = / & /;
const fs = require('fs');
const Character = require('./characters/');
Character.prototype = require('./characters/CharacterSheet-proto.js');

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

function loadCharacter (message, name) {
  const filePath = `./users/${message.author.id}/${name}.json`;
  if (!fs.existsSync(filePath))  return noCharacterFoundMessage;
  return JSON.parse(fs.readFileSync(filePath));
}

function storeCharacter (characterObject) {
  const filePath = `./users/${characterObject.userId}`;
  if (fs.existsSync(filePath)) {
    fs.open(`${filePath}/${characterObject.name}.json`, 'w', (err, file) => {
      if (err) throw err;
      fs.writeFileSync(file, JSON.stringify(characterObject));
      fs.close( file, err => {
        if (err) throw err;
      });
    });
  }
  else {
    fs.mkdirSync(filePath);
    fs.open(`${filePath}/${characterObject.name}.json`, 'w', (err, file) => {
      if (err) throw err;
      fs.writeFileSync(file, JSON.stringify(characterObject));

      fs.close( file, err => {
        if (err) throw err;
      });
    });
  }
}

//logs to console with a heading and footer
console.createCollapsable = (subject, content) => {

  //if content is null or undefined
  content = content? content:'Nothing found';

  console.groupCollapsed();
    console.log(`\n--------------------Start of ${subject}-----------------------`);
    console.log(content);
    console.log(`--------------------End of ${subject}-----------------------\n`);
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
    const cmds = message.content.toLowerCase().trim().substr(1).split(' ');
    switch (cmds[0]) {

      case 'load':
          currentCharacter = loadCharacter(message, cmds[1]);
          players.push(currentCharacter);
          if (currentCharacter) return message.channel.send(`<@${discordId}> ${currentCharacter.name} has been loaded.`);
        break;

      case 'save':
        storeCharacter(players.find( player => {return player.userId == discordId}));
        message.channel.send('Your character has been saved.');
        break;

      case 'partysize':
        if (!cmds[1] > 0 || typeof parseInt(cmds[1]) != 'number') return message.channel.send(partyOfZeroMessage);
        if (message.member.roles.cache.some(role=>role.name.toLowerCase() == ('artificer')) ||
          message.member.roles.cache.some(role=>role.name.toLowerCase() == ('the dm')) ) {
            numberOfPlayers = parseInt(cmds[1]);
            console.log(`party size: ${numberOfPlayers}`);
            message.reply(`The number of players is ${numberOfPlayers}\n <@&${getRoleId(message, 'the party')}> type "-newchar [name of your character]" to begin!`);
        }
      break;

      case 'newchar':
        if (!players.some((player) => player.userId == discordId) && message.member.roles.cache.some(role=>role.name.toLowerCase() == ('the party')) ) {
          let newPlayer = new Character(cmds[1], discordId);
          players.push(newPlayer);
          console.log(`<@${discordId}> added to the active players`);
          console.log(players);
          message.channel.send(`<@${discordId}> ${newCharacterCreatedMessage}`);
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
      console.createCollapsable('Active Players',players);
      console.createCollapsable('Your character in Queue',players.find( p => {return p.userId == discordId}));
      break;

      case 'roll':
        //if DM asks for roll but no # of players is not over 0, asks for input
        //else asks the party to roll
        if (message.member.roles.cache.some(role=>role.name.toLowerCase() == ('the dm')) ) {
          if (!numberOfPlayers > 0) {
            message.channel.send(`<@&${getRoleId(message, 'the dm')}> ${partyOfZeroMessage}`)
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
      message.channel.send(helpMessage);
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

    case 'inventory':
    if (!currentCharacter) return message.channel.send(`<@${discordId}> ${noCharacterFoundMessage}`);
    if (currentCharacter.items.length == 0) return message.author.send('There are no items in your inventory.');

    const inventoryResponse = currentCharacter.items.reduce((fullMessage, item) => {
      return fullMessage +
      `**${item.name}**
      ${item.description}
      =============================================\n`},'');
      message.author.send(inventoryResponse);
      break;

    case 'additem':
    if (!cmds[1]) return message.channel.send(`Please give the name followed by `);

    if (!currentCharacter) return message.channel.send(noCharacterFoundMessage);

    //deletes '-additem' and the space following from the contents of the message
    message.content = message.content.substring(cmds[0].length + 2);

    //makes array with index 0 (name): anything before separator
    //                 index 1 (description): anything after separator
    let nameAndDesc = message.content.split(itemSeparator);


    if (currentCharacter.items.some( item => {return item.name == nameAndDesc[0]}) ) return message.author.send(`You already have an item with the same name. Please try again with a different name.`)

    nameAndDesc = nameAndDesc.map( phrase => {return phrase.trim();});
    currentCharacter.addItem(nameAndDesc[0], nameAndDesc[1]);

    console.createCollapsable(`${currentCharacter.name}`, currentCharacter);
    message.channel.send(`"${nameAndDesc[0]}" has been added to your inventory!`);
    break;

    case 'removeitem':
      if (!currentCharacter) return message.channel.send(`<@${discordId}> You have not made a character. Use "-newchar [name of your character]" to create one`);
      if (currentCharacter.items.length == 0) return message.author.send('There are no items in your inventory.');
      if (!cmds[1]) return message.channel.send('Please provide the name of the item you want to remove.')

      //deletes '-removeitem' and lingering spaces from message content
      message.content = message.content.substring(cmds[0].length + 1).trim();

      console.log(currentCharacter.findIndex( item => {return item.name == message.content}) );


      // TODO: remove items. add removeItems method to character class
    }
  }
});

// TODO: make helpMessages.txt to store messages to use as an imported variable

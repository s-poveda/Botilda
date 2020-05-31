const Item = require('./itemClass.js');

class CharacterSheet {
  constructor (name = 'unnamed (so edgy!)' , userId, strength = 10, dex = 10, constitution = 10, intelligence = 10, wisdom = 10, charisma = 10) {
    this.userId = userId;
    this.name = name;
    this.strength = parseInt(strength);
    this.dexterity = parseInt(dex);
    this.constitution = parseInt(constitution);
    this.intelligence = parseInt(intelligence);
    this.wisdom = parseInt(wisdom);
    this.charisma = parseInt(charisma);

    this.strengthMod = this.mod(this.strength);
    this.dexterityMod = this.mod(this.dexterity);
    this.constitutionMod = this.mod(this.constitution);
    this.intelligenceMod = this.mod(this.intelligence);
    this.wisdomMod = this.mod(this.wisdom);
    this.charismaMod = this.mod(this.charisma);

    this.items = [];
  }

}
CharacterSheet.prototype.addItem = (name, description = 'no description.') => {
  // IDEA: let nameOfItem = new item; and change properties to cost (number), damage (string), description (string), attunement (boolean)
  this.items.push(new Item(name, description));
}

CharacterSheet.prototype.removeItem = (name = null) => {
  if (!name) return ;
  this.items.findIndex()
}

CharacterSheet.prototype.mod =  (score) => {
  let modifier;
  if (isNaN(score)) return console.log('couldn\'t set Modifiers. NaN error.\n')
  switch (score) {
    case 1:
    modifier = -5; break;
    case 2:
    case 3:
    modifier = -4; break;
    case 4:
    case 5:
    modifier = -3; break;
    case 6:
    case 7:
    modifier = -2; break;
    case 8:
    case 9:
    modifier = -1; break;
    case 10:
    case 11:
    modifier = 0; break;
    case 12:
    case 13:
    modifier = 1; break;
    case 14:
    case 15:
    modifier = 2; break;
    case 16:
    case 17:
    modifier = 3; break;
    case 18:
    case 19:
    modifier = 4; break;
    case 20:
    case 21:
    modifier = 5; break;
    case 22:
    case 23:
    modifier = 6; break;
    case 24:
    case 25:
    modifier = 7; break;
    case 26:
    case 27:
    modifier = 8; break;
    case 28:
    case 29:
    modifier = 9; break;
    case 30:
    modifier = 10;
  }
  return modifier
}
module.exports = CharacterSheet;

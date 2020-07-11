
const { addItem, removeItem, mod } = require('./characterMethods'); // TODO: extract methods from here to revitilize character object after loading

class Character {
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

  addItem = addItem;

  removeItem = removeItem;

  mod = mod;
}

//Due to stringifing, methods are removed from saved JSONs. This adds them back (hopefully)
function revitilize  (parsedCharJson) {
  parsedCharJson.mod = mod;
  parsedCharJson.addItem = addItem;
  parsedCharJson.removeItem = removeItem;
}
module.exports = { Character, revitilize };

# Botilda

This is a WIP discord bot for use during Dungeons & Dragons sessions.
Integrates a queue to organize your hectic battles and spell search functionality to quickly how many more times you can cast the same spell against a wall!

## Required Roles and Channels

### Roles

**All roles are case insensitive and exclusive** e.g. "the party" works just as well as "The Party", "tHe PartY", etc; a player cannot have "the party" and "the dm" role at the same time


* "**The DM**"
* "**The Party**"

### Channels

**Channels names are case-sensitive**

* "**spell-search**" - spells search results will be displayed in this channel regardless of where they were requested from in the server.

## Commands

Legend:
- `{ stuff in curly braces is required }`
- `[ stuff in square brackets is optional ]`

**All commands should be prefixed with a "-" (*dash*)**

### For Everyone

* `spellsearch {spell name}` or `ss {spell name}`
	* Displays information found through the spell's name. Does not tolerate misspellings.

### For the DM/GM

* `partysize {number of party members rolling}`
	* Set the party size to a number. This number is used when the party begins to submit their roles. Once that number of players have submitted their role, the results will be displayed in the channel that the last player uses to send their roll.


* `roll {name of the check}`
	* Sends message to "the party" requesting them to "roll for {name of the check}" on the channel the roll was issued.

* `clear-responses`
	* Clears all responses received so far from the players. All players must resubmit their roll to complete the queue again.

### For the Players

* `newchar [name of your character | defaults to "unnamed"]`
	* Adds a new character to the active players.

* `load {name}` or `l {name}`
	* Adds a previously saved character to the active players.

* `save`
	* Saves the current state of the character being used.

* `inventory` or `i`
	* Display your current inventory in a direct message.

* `additem {item name} [ && item description | defaults to "no description"]`
	* Adds an item and description to your inventory.

	* "&&" is used to separate the name and description. Make sure neither use "&&" inside of each text.

* `removeitem {item name}` or `rmi {item name}`
	* Removes item by item name from your inventory
	* This cannot be undone, FYI.

* `roll {integer number}`
	* Submits your roll to the queue after the DM requests a roll. Once all players have submitted their roll, the message will be displayed in the channel the last player submits their roll.

## Contributions
 A big "Thank you" to everyone working on the **[D&D 5e API](https://github.com/bagelbits/5e-srd-api)** used for spell searching.

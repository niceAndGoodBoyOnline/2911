const Command = require('../models/Command');

//-------------------------------------------------------------------------------------------------------------------
// The Repo files are responsible for database transactions. They grab, update, delete, create stuff in the database.
// They use query commands to interact with the database. Similar-ish enough for you to understand a bit.
//-------------------------------------------------------------------------------------------------------------------


class CommandRepo {
    CommandRepo() {        
    }

    // Get all items from the database
    async getCommands() {
        // Find all items in the database.
        // find() means to get all.
        // exec() means to execute the query command.
        let commands = await Command.find().exec();
        return commands;
    }

    // Get the index of a certain item
    async getIndex(name) {
        // Find all items in the database
        // find() means to get all
        // exec() means to execute the query command
        let commands = await Command.find().exec();
        // for each item,
        for(let i=0;i<commands.length;i++){
            // if the item matches the passed name,
            if(commands[i].command == name){
                // return the index
                return i
            }
        }
    }
}
module.exports = CommandRepo;


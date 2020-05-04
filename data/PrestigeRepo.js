const Prestige = require('../models/Prestige');

//-------------------------------------------------------------------------------------------------------------------
// The Repo files are responsible for database transactions. They grab, update, delete, create stuff in the database.
// They use query commands to interact with the database. Similar-ish enough for you to understand a bit.
//-------------------------------------------------------------------------------------------------------------------


class PrestigeRepo {
    PrestigeRepo() {        
    }

    // Get all of the prestige items
    async getPrestigeItems(){
        // find() means to find everything
        // exec() means to execute the query
        let prestigeItems = await Prestige.find().exec()
        
        // return all the items in Prestige collection
        return prestigeItems
    }
}
module.exports = PrestigeRepo;


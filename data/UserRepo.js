const User = require('../models/User');

//-------------------------------------------------------------------------------------------------------------------
// The Repo files are responsible for database transactions. They grab, update, delete, create stuff in the database.
//-------------------------------------------------------------------------------------------------------------------


class UserRepo {
    UserRepo() {        
    }

    // Get the user from the database by email
    async getUserByEmail(email) {
        //findOne() means to find the user with the matching information.
        var user = await User.findOne({email: email});
        //If a user is found,
        if(user) {
            let respose = { obj: user, errorMessage:"" }
            // return the user
            return respose;
        }
        //if a user is not found,
        else {
            //return nothing
            return null
        }
    }

    // Get bitcoin from a particular user
    async getBitcoin(email) {
        // findOne() means to find the user with the matching information
        var user = await User.findOne({email: email});
        let bitcoin = user.bitcoin
        console.log(bitcoin)

        //return the user's bitcoin
        return bitcoin
    }
    async findCommand(command, email){
        let userCommand = await User.findOne({email:email});

        for (let i = 0;i<userCommand.commands.length;i++){
            if (command == userCommand.commands[i]){
                return true
            }
        }
        return false
    }


    // Save the user's bitcoin to the database
    async saveProgress(email, bitcoin) {
        //updateOne() means to update one user in the database.
        let updated = await User.updateOne(
            // This is to find the user with the following information
            { email:email},
            // $set means to change the information.
            // In this case, we change the user's bitcoin data to the data that was passed into this function.
            {$set: {bitcoin:bitcoin}}
        )
        // return a message
        return "Progress has been saved. You can safely close the browser."
    }

    // Make the transaction happen.
    // Basically, increase the user's item quantity.
    async makeTransaction(email, index, quantity) {
        // findOne() means to find the user with the matching information
        let user = await User.findOne({email:email});
        // Grab the user's item quantity
        let itemsArray = user.items
        // Increase appropriate quantity by one
        itemsArray[index] = itemsArray[index] + quantity
        console.log(itemsArray)
        //updateOne() means to update one user in the database
        let updated = await User.updateOne(
            // Find the user with the following information
            {email:email},
            // $set means to change the information.
            // In this case, we change the user's item array quantity to the data we grabbed and changed above.
            {$set: {items:itemsArray}}
        )
        //thank the user
        return itemsArray
    }

    // Get the user's item quantity
    async getItemArray(email){
        // findOne() means to find the user with the following information
        let user = await User.findOne({email:email})
        // return the user's item quantity
        return user.items
    }

    // Get the user's known commands
    async getCommandArray(email){
        // findOne() means to find the user with the following information
        let user = await User.findOne({email:email})
        // return the user's item quantity
        return user.commands
    }

    // Increase ALL user's bitcoins.
    // This is the afk feature.
    async autoBitcoin(){
        // updateMany() means to update ALL users in the database.
        let updated = await User.updateMany(
            // This is empty so that the database knows that we refer to EVERYONE.
            // Its like the * wildcard.
            { },
            // $inc means to increase the following information by 5.
            {$inc: {bitcoin:5}}
        )
        // return updated. This is for debugging purposes.
        return updated
    }

    // Checks if the registering user already exists.
    async checkUser(email, username){
        // findOne() means to find the user with the following information
        let user = await User.findOne({email:email})
        console.log(user)
        // if a user with the same email is found,
        if(user){
            // let em know the email already exists
            return "User already exists with that email."
        }
        // findOne() means to find the user with the following information
        let user2 = await User.findOne({username:username})
        console.log(user)
        // if a user with the same username is found,
        if(user2){
            // let em know the email already exists
            return "User already exists with that username."
        }
        // If there is no user with the same username and email in the database, return nothing.
        return ''
    }

    // Get user's prestige points from the database by email
    async getPrestigePoints(email,){
        // Find the user with the corresponding email
        let user = await User.findOne({email:email})

        // Return the user's prestige points
        return user.prestigePoints
    }

    // Save the user's prestige points to the database
    async savePrestigeProgress(email, prestigePoints) {
        //updateOne() means to update one user in the database.
        let updated = await User.updateOne(
            // This is to find the user with the following information
            { email:email},
            // $set means to change the information.
            // In this case, we change the user's prestige points data to the data that was passed into this function.
            {$set: {prestigePoints:prestigePoints}}
        )
        // return a message
        return "Prestige points has been saved."
    }

    // Resets the user's bitcoins and items in exchance for prestige points
    async resetGainPrestige(email, prestige, prestigeArray){
        // Set a variable for the items the user will have (aka nothing)
        let items = []
        for(let i=0;i<prestigeArray.length;i++){
            items.push(0)
        }
        // Set a variable for the bitcoin the user will have (aka 0)
        let bitcoin = 0
        // Update the user's prestige points
        let updated = await User.updateOne(
            // Find the user through their email
            {email:email},
            // Increase the user's prestige points by how many they bought
            {$inc: {prestigePoints:prestige}}
        )

        // Update the user's items and bitcoins
        let updated2 = await User.updateOne(
            // Find the user through their email
            {email:email},
            // Set the items and bitcoins to the above variables (aka nothing)
            {$set: {items:items, bitcoin:bitcoin}}
        )
        // Return the updates to the function in the prestige.ts file
        return updated, updated2
    }

    // Calculates the amount of prestige points the user will get on reset
    async calculatePrestige(email) {
        // Get the user through their email
        var user = await User.findOne({email: email});
        // Get the user's bitcoin for the calculation
        let bitcoin = user.bitcoin
        // Set the variable for the initial cost for a prestige point
        let prestigeCost = 10000
        // Set the variable for how many prestige points you can buy
        let prestige = 0
        // Start a while loop while you have more bitcoins than the prestige cost
        while (prestigeCost <= bitcoin) {
            // Get an additional prestige point
            prestige += 1
            // Formula for calculating the next cost of a prestige point
            prestigeCost = Math.pow(prestigeCost, 1.1)
            // Have a flat cost for clarity
            prestigeCost = Math.floor(prestigeCost)
        }
        // Return the prestige points the user will get
        // This will be used in the function resetGainPrestige()
        return prestige
    }

    // Make the prestige transaction happen.
    // Basically, increase the user's prestige quantity.
    async makePrestigeTransaction(email, index) {
        // findOne() means to find the user with the matching information
        let user = await User.findOne({email:email});
        // Grab the user's item quantity
        let prestigeArray = user.prestige
        // Increase appropriate quantity by one
        prestigeArray[index] = prestigeArray[index] + 1
        console.log(prestigeArray)
        //updateOne() means to update one user in the database
        let updated = await User.updateOne(
            // Find the user with the following information
            {email:email},
            // $set means to change the information.
            // In this case, we change the user's item array quantity to the data we grabbed and changed above.
            {$set: {prestige:prestigeArray}}
        )
        //thank the user
        return "Thank you come again!"
    }

    async getUserPrestigeItems(email) {
        let user = await User.findOne({email:email})
        let prestigeItems = user.prestige
        console.log(prestigeItems)

        return prestigeItems
    }


}
module.exports = UserRepo;


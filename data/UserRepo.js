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

    async resetGainPrestige(email){
        let items = [0,0,0]
        let bitcoin = 0
        let updated = await User.updateOne(
            {email:email},
            {$inc: {prestigePoints:1}}
        )

        let updated2 = await User.updateOne(
            {email:email},
            {$set: {items:items, bitcoin:bitcoin}}
        )

        return updated, updated2
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


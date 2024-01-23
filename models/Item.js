const mongoose = require('mongoose')

//setting some rules on how this data should be structured
const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

//now we export it so we can use it. We used the word 'Item' when making those create, read, update, delete methods. We then put our schema into the model.
module.exports = mongoose.model('Item', ItemSchema);
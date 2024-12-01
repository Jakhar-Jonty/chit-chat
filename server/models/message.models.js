const mongoose = require('mongoose')

const messageShema  = mongoose.Schema({

    senderId:
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    receiverId:
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    content:
    {
        type: String,
        required: true
    },
    chatId:
    {
         type: mongoose.Schema.Types.ObjectId, 
        ref: 'Chat'
    }
    
},{timestamps:true})

exports.Message = mongoose.model('Message', messageShema)


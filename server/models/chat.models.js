const mongoose = require('mongoose')

const chatSchema  = mongoose.Schema({
    users:
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    lastMessage:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    
},{timestamps:true})
exports.Chat = mongoose.model('Chat', chatSchema)
const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username:
    {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    email: 
    { 
        type: String,
        trim: true, 
        required: true, 
        unique: true 
    },
    password: 
    { 
        type: String,
        required: true 
    },
    picture: 
    { 
        type: String,
        default: "https://picsum.photos/200"
    },
    chatsWith:
        [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'
            }
        ],
    allChats:
        [
            {
                 type: mongoose.Schema.Types.ObjectId, 
                 ref: 'Chat'
            }
        ]

})

exports.User = mongoose.model("User",userSchema);
const { User } = require("../models/user.models");
const { Chat } = require("../models/chat.models")
exports.fetchChat = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user ID is available from authenticated request

        // Find the user and populate the allChats field with Chat data
        const userWithChats = await User.findById(userId)
            .populate({
                path: 'allChats',
                populate: {
                    path: 'users lastMessage',   // Populates the users in each Chat
                    select: 'username picture content'  // Only get username and picture from each user
                }
            })
            .select('allChats');  // Only return the allChats field

        if (!userWithChats) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("allchats=>", userWithChats);

        res.status(200).json({ allChats: userWithChats.allChats, loggedInUser: req.user });
    } catch (error) {
        console.log("Error fetching all chats:", error);
        res.status(500).json({ message: "Error fetching all chats", error });
    }
};

exports.newChat = async (req, res) => {
    const userId = req.user._id
    const { friendId } = req.body
    console.log("id=>",req.body);
    
    
    try {
        const friend = await User.findOne({ _id: friendId }).select("-password")

        let chat = await Chat.findOne({
            users: {
                $all: [userId, friend._id]
            }
        })
    
        console.log("is chat=>", chat);
        if(chat) 
            return res.status(201).json({chatId:chat._id})
    
        if (friend) {
            const newChat = new Chat({
                users: [userId, friend._id],
                lastMessage: null
            })
        
            const newchat = await newChat.save()
            console.log("Chat after update or creation=>", newchat);
            if(newchat) return res.status(200).json({chatId:newchat._id})
        }
    } catch (error) {
        console.log('error=>',error);
        res.status(500).json({message:"Something went wrong"})
    }


}

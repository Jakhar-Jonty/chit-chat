const { User } = require("../models/user.models");
const { Message } = require("../models/message.models");
const { Chat } = require("../models/chat.models");


// Create new Message  
exports.messageStore = async (req, res) => {
    const { message } = req.body;
    const userId = req.user._id;
    const friendId = req.params.friend

    // console.log("message=>", message, "user=>", userId, "\nfriend=>", friendId);

    try {
        let chat = await Chat.findOne({
            users: {
                $all: [userId, friendId]
            }
        })

        // console.log("is chat=>", chat);

        if (!chat) {
            chat = new Chat({
                users: [userId, friendId],
                lastMessage: null
            })
            await chat.save()
            // console.log("Chat after update or creation=>", chat);
        }


        await User.findByIdAndUpdate(userId, {
            $addToSet: { 
                allChats: chat._id, 
                chatsWith: friendId 
            }
        });

        await User.findByIdAndUpdate(friendId, {
            $addToSet: { 
                allChats: chat._id, 
                chatsWith: userId
            }
        });
    


        const newMessage = new Message({
            senderId: userId,
            receiverId: friendId,
            content: message,
            chatId: chat._id
        })
        let savedMessage = await newMessage.save()
        
        
        savedMessage = await Message.findOne({_id:savedMessage._id}).populate({path:"senderId receiverId",select:"username picture"})
        console.log("new=>", savedMessage);
            chat.lastMessage = savedMessage._id
            await chat.save()
         
        res.status(200).json({ message: `message stored successfully ${newMessage}`,savedMessage:savedMessage });

    } catch (error) {
        console.log("Error while updating or creating chat:", error);
        res.status(500).json({ message: "Error updating or creating chat", error });
    }
};


// delete a message 

exports.deleteMessage = async(req,res)=>{
    const {messageId} = req.params
    console.log("messageId=>",messageId);
    
    try {
       await Message.deleteOne({_id:messageId})
       console.log("message deleted successfully");
       res.status(200).json({message:"message deleted "})
    } catch (error) {
        console.log("Error deleting Message=>",error);
    }
}

// fetch all messages

exports.allMessages = async(req,res)=>{
   const {chatId} = req.params

   console.log("chat id",chatId);

   try {
       const chat = await Chat.findOne({_id:chatId}).populate({path:"users",select:"picture username"})
        const allmessages = await Message.find({chatId}).populate({path:"senderId receiverId",select:"username picture"})
        
        // console.log("all message=>",allmessages);
        
        return res.status(200).json({allmessages:allmessages,loggedInUser:req.user,users:chat.users})
         
   } catch (error) {
        console.log("error while fetching chat",error)
        return res.status(500).json({"error":error})
   }
   
}
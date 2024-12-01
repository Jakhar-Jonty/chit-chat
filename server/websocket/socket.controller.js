module.exports = (io)=>{
    io.on("connection",(socket)=>{
        console.log('User Connected',socket.id)
        
        socket.on("sendMessage",(message)=>{
            const {chatId,content,senderId,ReceiverId} = message
            socket.to(chatId).emit("receiveMessage",message)
        })
        
        socket.on("joinChat",(chatId)=>{
            socket.join(chatId)
            console.log(`Socket joined ChatId ${chatId}`)
        })
        socket.on("disconnect",()=>{
            console.log("User disconnected",socket.id);
        })
    })
}
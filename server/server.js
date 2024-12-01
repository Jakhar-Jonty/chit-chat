const express  = require("express");
const http= require("http");
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
const {Server} = require('socket.io')
const {connectdb} = require("./config/dbconnection")
const userRoutes = require('./routes/user.routes.js')
const {verifyToken} = require('./middleware/jwtauth.middleware.js')
const messageRoutes  =require("./routes/message.routes.js")
const chatRoutes = require("./routes/chat.routes.js")
dotenv.config()
app.use(express.json())
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST","PUT","PATCH","DELETE"]
    }
})
app.use(cors())
// database connection
connectdb()
require("./websocket/socket.controller.js")(io)




// Routes

app.use("/api/user",userRoutes);
app.use('/api/message',verifyToken,messageRoutes)
app.use("/api/chat",verifyToken,chatRoutes)

// server
server.listen(process.env.PORT ,()=>{
    console.log(`we are running on ${process.env.PORT}`); 
})

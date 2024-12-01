const express = require('express')
const routes = express.Router()
const {messageStore, deleteMessage, allMessages} = require("../controllers/message.controllers")

routes.post("/messagestore/:friend",messageStore)

routes.get("/allmessage/:chatId",allMessages)

routes.delete("/deletemessage/:messageId",deleteMessage)


module.exports = routes
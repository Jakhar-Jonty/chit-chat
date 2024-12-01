const express = require('express')
const { fetchChat, newChat } = require('../controllers/chat.controllers')
const { verifyToken } = require('../middleware/jwtauth.middleware')
const routes = express.Router()

routes.get("/",verifyToken,fetchChat)
routes.post("/new",verifyToken,newChat)
module.exports = routes
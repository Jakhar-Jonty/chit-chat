const express = require('express')
const { registerUser, loginUser, searchUser } = require('../controllers/user.controllers')
const { verifyToken } = require('../middleware/jwtauth.middleware')
const routes = express.Router()

routes.get("/",verifyToken,(req,res)=> res.status(200).json({message:"Already logged In"}))
routes.post("/register",registerUser)
routes.post('/login',loginUser)
routes.get('/search/:searchUser',verifyToken,searchUser)
module.exports = routes
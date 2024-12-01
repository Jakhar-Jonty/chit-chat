const bcrypt = require('bcrypt')
const {User} = require('../models/user.models')
const jwt = require('jsonwebtoken')
const { search } = require('../routes/user.routes')
const { sendWelcomeMessage } = require('./welcomeMail.controller')

// const sendWelcomeMessage = require('../config/welcomeMail')

// Register user
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body
    console.log(req.body);

    if (!username || !password || !email) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
         //  Check if user already exists
         //check email
       const emailExists = await User.findOne({ email })
            if (emailExists) return res.status(400).json({ message: "Email already exists" })

        // check username
          const usernameExists = await User.findOne({ username })
            if (usernameExists) return res.status(400).json({ message: "Username already exists" })

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword})
        await newUser.save()
        res.status(201).json({ message: "User registered successfully" })
        // send user the welcome message using nodemailer
            sendWelcomeMessage(newUser)
    } catch (error) {
        console.error(error)
        // Handle Duplicate Key Errors Gracefully
        if (error.code === 11000) {
            const duplicateKeyError = Object.values(error.keyValue)[0]
            return res.status(400).json({ message: `Duplicate ${duplicateKeyError} value` })
        }
        // If other error occurs, return 500
        return res.status(500).json({ message: "Error registering user" })
    }
}



// login user


exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        console.log("Please provide email and password");
        
        return res.status(400).json({ message: 'Please provide email and password' })
    }
    try {
        const isUser = await User.findOne({ email }).select('+password')
        if (!isUser) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const isMatch = await bcrypt.compare(password, isUser.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        // Generate JWT token
        const token = jwt.sign(
            { userId: isUser._id }, 
            process.env.JWT_SECRET,
            { expiresIn: '3d' } 
        );
        console.log("login success", token);
        
        // Send the token in the response
        res.status(200).json({ message: 'Login successful', token: token });

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.searchUser  = async(req,res)=>{
    const {searchUser} = req.params
    const loggedUser = req.user 
    try {
        const users  = await User.find({username:{$regex:`^${searchUser}`,$options:'i'},_id:{$ne:loggedUser._id}}).select("-password -chatsWith -allChats")
        users.length>0 ? res.status(200).json({allusers:users}) :  res.status(404).json({ message: "No users found" });
    } catch (error) {
        console.log("error while searching",error);
        res.status(500).json({ message: 'Server error' })
    }
}
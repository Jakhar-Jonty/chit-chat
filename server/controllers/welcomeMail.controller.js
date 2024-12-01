const nodemailer = require('nodemailer')
 // send user the welcome message using nodemailer 

exports.sendWelcomeMessage = (newUser)=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.NODE_EMAIL_HOST,
            pass: process.env.NODE_EMAIL_PASSKEY
        }
    })
    
    const sendWelcomeMessage = async (newUser)=>{
        const mailOptions = {
            from : "Chit-Chat",
            to :newUser.email,
            subject : "Welcome to Chit Chat App",
            text: `Hi ${newUser.username},\n\nWelcome to ChitChat! We're excited to have you.\n\nBest regards,\nThe ChitChat Team`, // Plain text body
            html: `<h3>Hi ${newUser.username},</h3><p>Welcome to <strong>ChitChat</strong>! We're excited to have you.</p><p>Best regards,<br>The ChitChat Team</p>` // HTML body
        } 
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
      } catch (error) {
        console.error('Error sending email: ', error);
      }
    }
    sendWelcomeMessage(newUser);
    
}
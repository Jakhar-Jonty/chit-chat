const mongoose = require('mongoose');

// Connect to MongoDB

exports.connectdb = ()=>{
    mongoose.connect(`${process.env.MONGO_URI}/${process.env.DATABASE_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true})
   .then(() => console.log('MongoDB Connected...')).catch((err) =>{
    console.error(err.message);
    process.exit(1);
   })
}
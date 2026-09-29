require('dotenv').config();
const mongoose = require ('mongoose');
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once('open',()=>{
    console.log(`Connected to MongoDB:${mongoose.connection.name}`);
});

mongoose.connection.on('error',(error)=>{
    console.log("Mongoose connection error", error)
})

mongoose.connection.on('close', ()=>{
    console.log("Connection to Mongoose is closed")
})

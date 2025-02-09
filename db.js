const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/inotebook";
// const mongoURI = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI).then((err) => { //"mongodb://127.0.0.1:27017/inotebook"
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log(err);
    });
    
}

module.exports = connectToMongo;
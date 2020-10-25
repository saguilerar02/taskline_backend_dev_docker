import mongoose from 'mongoose'
import chalk from 'chalk'

//require database URL from dotenv

var connected = chalk.bold.green;
var error = chalk.bold.redBright;
var disconnected = chalk.bold.gray;
var termination = chalk.bold.magenta;

//export this function and imported by server.js
mongoose.set('useFindAndModify', false);


let connection =function(){
    var dbURL = process.env.DATABASE as string;
     mongoose.connect(dbURL, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true});

    mongoose.connection.on('connected', function(){
        console.log(connected("Mongoose default connection is open to ", dbURL));
    });

    mongoose.connection.on('error', function(err){
        console.log(error("Mongoose default connection has occured "+err+" error"));
    });

    mongoose.connection.on('disconnected', function(){
        console.log(disconnected("Mongoose default connection is disconnected"));
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log(termination("Mongoose default connection is disconnected due to application termination"));
            process.exit(0)
        });
    });
}

export default connection;
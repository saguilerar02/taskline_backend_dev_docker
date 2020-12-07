import mongoose from 'mongoose'
import chalk from 'chalk'


const connected = chalk.bold.green;
const error = chalk.bold.redBright;
const disconnected = chalk.bold.gray;
const termination = chalk.bold.magenta;

mongoose.set('useFindAndModify', false);


let connection =function(){
    const dbURL = process.env.DATABASE as string;
     mongoose.connect(dbURL, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true});

    mongoose.connection.on('connected', function(){
        console.log(connected("Se ha conectado con MongoDB en la direccion... ", dbURL));
    });

    mongoose.connection.on('error', function(err){
        console.log(error("Ha ocurrido el siguiente erro: "+err));
    });

    mongoose.connection.on('disconnected', function(){
        console.log(disconnected("Se ha desconectado de MongoDB exitosamente"));
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log(termination("La aplicación ha terminaado y la conexción a MongoDB también"));
            process.exit(0)
        });
    });
}

export default connection;

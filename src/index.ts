import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import connection from './database/MongoConnection';
import { getCerts } from './services/CertificateGetter';
import { createTransporter } from './services/Mailer';
import { job } from './services/MailerNotifierServiceImpl';

const result = dotenv.config({path:".env"});

const run =async  function () {
    getCerts();
    if(!result.error){
        try {
            app.set('port',3000);
            http.createServer(app).listen(app.get('port'));
            console.log(`Listening on http://localhost:${app.get('port')}`);
            connection();
            createTransporter();
            job.start();
        } catch (error) {
            console.error('Algo salio mal, ERROR conectando con la base de datos')
            job.stop()
        }
    }else{
        console.error('Algo salio mal, ERROR cargando variables de entorno')
        
    }
}

run();







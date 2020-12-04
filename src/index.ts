import dotenv from 'dotenv';
import https from 'https';
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
            
            let  options = {
                key: process.env.PRIVATE_KEY,
                cert: process.env.CSR,
            };
            if(options && options.key && options.cert && options.key.length>0  && options.cert.length>0){
                await https.createServer(options,app).listen(3443);
                console.log(`Listening on http://localhost:3443`);
            }else{
                app.set('port', process.env.PORT || 3000);
                https.createServer(app).listen(app.get('port'));
                console.log(`Listening on http://localhost:${app.get('port')}`);
            }
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







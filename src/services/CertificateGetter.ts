import fs from 'fs'


export function getCerts() {
    try{
        if(!process.env.PRIVATE_KEY){
            process.env.PRIVATE_KEY = fs.readFileSync(process.env.CERTIFICATE_DIR+"privateKey.pem").toString();
        }
        if(!process.env.PUBLIC_KEY){
            process.env.PUBLIC_KEY = fs.readFileSync(process.env.CERTIFICATE_DIR+"publicKey.pem").toString();
        }
        if(!process.env.CSR){
            process.env.CSR= fs.readFileSync(process.env.CERTIFICATE_DIR+"cert.pem").toString();
        }    
    }catch(err){
        console.log(err);
    }
}

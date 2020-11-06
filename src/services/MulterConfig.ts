import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
//IMAGES
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!fs.existsSync(process.env.UPLOADS as string)){
            fs.mkdirSync(process.env.UPLOADS as string);
        }
      cb(null, process.env.UPLOADS as string)
    },
    filename: function (req, file, cb) {
        if( file && path.extname(file.originalname)){
            cb(null, uuidv4.toString()+path.extname(file.originalname));
        }
    }   
  })

export const uploadImageProfileImage = multer({
    dest:process.env.UPLOADS,
    storage:storage,
    limits:{fileSize:20000000},
    fileFilter:(req,file,cb)=>{
        try{
            const filetypes = /jpeg|jpg|png|webp|gif/
            if(filetypes.test(file.mimetype) && filetypes.test(path.extname(file.originalname).substring(1))){
                cb(null,true);
            }else{
                cb(new Error("Error: Imagen inválida"));
            }
        }catch(err){
            cb(new Error("Error: Ha ocurrido un error al cargar el archivo"));
        }
    }
});


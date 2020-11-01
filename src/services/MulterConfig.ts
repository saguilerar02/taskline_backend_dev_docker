import fs from 'fs';
import multer from 'multer';
import path from 'path';
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
            cb(null, 'profile-image-' + req.body.username+path.extname(file.originalname));
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
            console.log(file.mimetype)
            console.log(path.extname(file.originalname).substring(1))
            if(filetypes.test(file.mimetype) && filetypes.test(path.extname(file.originalname).substring(1))){
                console.log(req.body.createdBy)
                cb(null,true);
            }else{
                cb(new Error("Error: Imagen inválida"));
            }
        }catch(err){
            cb(new Error("Error: Ha ocurrido un error al cargar el archivo"));
        }
        
        
    }
    
});


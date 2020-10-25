import { Schema } from "mongoose";
import { ISendToTask } from "./ISendToTask";
//import { itemSchema } from "./ItemSchema";

export const sendToTaskSchema = new Schema({
     
    sendTitle: {
        type:String,
        minlength:3,
        maxlength:75,
        trim:true,
        required:[true, "El envío necesita un titulo"]
    },
    sendBody:{
        type:String,
        minlength:3,
        trim:true,
        required:[true, "El envío necesita un cuerpo"]
    },
    sendBlobURL:{
        type:String,
        trim:true
    }
});

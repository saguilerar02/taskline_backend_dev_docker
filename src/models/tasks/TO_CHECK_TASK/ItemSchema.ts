import { Schema } from "mongoose";

export const itemSchema = new Schema({
    name:{
        type:String,
        required:true,
        minlength:2,
        maxlength:75,
        trim:true
    },
    quantity:{
        type:Number,
        min:1,
        max:9999999,
        default:1,
        required:true
    },  
    done:{
        type:Boolean,
        default:false
    }
})

import { Schema } from "mongoose";
//import { itemSchema } from "./ItemSchema";


export const sendToTaskSchema = new Schema({
    receivers:{
        type:[{
                type:String,
                match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    ,'Invalid email'],
                required:[true,'Email is required'],
                unique:true,
                trim:true
        }],
        required:true,
        validate:{
            validator:
                function(v:[String]){
                    return v.length>20?false:true
                },
            message:"Only 20 reveivers"
        }
    }
});



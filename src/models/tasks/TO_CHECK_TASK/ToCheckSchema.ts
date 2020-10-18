import { Schema } from "mongoose";
import { itemSchema } from "./ItemSchema";


export const toCheckTaskSchema = new Schema({
    items:{
        type:[itemSchema],
        required:true,
        validate:{
            validator:
                function(v:[Schema.Types.ObjectId]){
                    return v.length>99?false:true
                },
            message:"Only 99 items per task"
        }
        
    }
});




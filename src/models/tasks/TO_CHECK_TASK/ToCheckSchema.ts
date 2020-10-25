import { Schema } from "mongoose";
import { itemSchema } from "./ItemSchema";
import { IToCheckTask } from "./IToCheckTask";

const ITEMS=99

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



toCheckTaskSchema.pre<IToCheckTask>("validate",function(next){

    if(this.items.length<0 || this.items.length>=ITEMS){
        throw new Error("Solo puedes añadir "+ITEMS+" items a la lista, aún puedes "+(ITEMS-this.items.length)+" más");
        
    }else{
        next();
    }
    
})
import moment from "moment";
import { Schema } from "mongoose";
import Task from "../../tasks/TASK/Task";
import { ITaskList } from "./ITaskList";



export const list_schema = new Schema(
    {
        name: {
            type:String,
            min:3,
            max:45,
            trim:true,
            required:[true, "The lists´s title is needed"]
        },
        tasks:[{
            type:Schema.Types.ObjectId,
            ref:"Task",
            validate:{
                validator:
                    function(v:any[]){
                        return v.length>30?false:true
                    },
                message:"Only 5 task per list"
            }
            
        }],
        createdAt: {
            type:Date,
            default: moment().toDate()
        },
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        }   
    }
);


list_schema.pre<ITaskList>("remove",async function(next){

    const del = await Task.deleteMany({_id:{$in:this.tasks}});

    if(del.ok && del.deletedCount==this.tasks.length){
        next();
    }else{
        throw new Error("Something went wrong");
    }

})


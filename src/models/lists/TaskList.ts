import {Document,Schema, model } from "mongoose";
import Task, { GotoTask } from "../tasks/TASK/Task";

export interface ITaskList extends Document{

    name: String,
    tasks:[Schema.Types.ObjectId]
    created_at:Date,
    created_by:Schema.Types.ObjectId
}

export const itinerary_schema = new Schema(
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
                    function(v:[Schema.Types.ObjectId]){
                        return v.length>5?false:true
                    },
                message:"Only 5 task per list"
            }
            
        }],
        

            
    }
);


itinerary_schema.pre<ITaskList>("remove",async function(next){

    const del = await Task.deleteMany({_id:{$in:this.tasks}});

    if(del.ok && del.deletedCount==this.tasks.length){
        next();
    }else{
        throw new Error("Something went wrong");
    }

})

const TaskList =  model("Itinerary", itinerary_schema, "lists");
export default TaskList;
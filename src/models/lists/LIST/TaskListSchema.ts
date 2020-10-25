import moment from "moment";
import { Schema } from "mongoose";
import Reminder from "../../reminders/Reminder";
import { ITask } from "../../tasks/TASK/ITask";
import Task from "../../tasks/TASK/Task";
import { ITaskList } from "./ITaskList";
import TaskList from "./TaskList";



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

   
    let deletedTasks = await Task.deleteMany({_id: { $in: this.tasks } })
    let deletedtReminders = await Reminder.deleteMany({idTask: { $in: this.tasks } });


    if(deletedTasks.deletedCount && deletedTasks.deletedCount>0 && 
        deletedtReminders.deletedCount && deletedtReminders.deletedCount){
        next();
    }else{
        throw new Error("Something went wrong");
    }

})


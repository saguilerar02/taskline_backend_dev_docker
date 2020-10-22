import { Schema } from "mongoose";
import Task from "../tasks/TASK/Task";
import { IReminder } from "./IReminder";
import Reminder from "./Reminder";

export const reminder_schema = new Schema(
    {
        remind_at: {
            type:Date,
            required:[true, "The reminder date is needed"]
        },
        reminder_data:{
            type:Schema.Types.Mixed
        },
        remind_to:{
            type: [String],
            match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ,'Invalid email'],
            required:true,},
        reminded:{
            type:Boolean,
            default:false
        },
        idTask:{
            type:Schema.Types.ObjectId,
            required:true
        }
    }
);

reminder_schema.pre<IReminder>("save",async function (next) {
    
    if(this.idTask){
        let t = await Task.findOneAndUpdate({"_id":this.idTask},{ '$push': { 'reminders': this._id } })
        if(t){
            next();
        }else{
            next(new Error("Task not found")) ;     
        }
    }else{
        next(new Error("Task id is null or empty"));   
    }
    
});

reminder_schema.pre<IReminder>("remove",async function (next) {

    if(this.idTask){
         let tl = await Task.findOneAndUpdate({"_id":this.idTask},{ '$pull': { 'reminders':{_id:this._id } }});
        if(tl){
            next()
        }else{
            throw new Error("TaskList not found");     
        }
    }else{
        throw new Error("TaskList id is null or empty");   
    }
    
});

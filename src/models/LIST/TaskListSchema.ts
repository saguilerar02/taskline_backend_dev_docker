import moment from "moment";
import { Schema } from "mongoose";
import Reminder from "../REMINDER/Reminder";
import Task from "../TASK/Task";
import { ITaskList } from "./ITaskList";



export const list_schema = new Schema(
    {
        name: {
            type:String,
            min:3,
            max:45,
            trim:true,
            required:[true, "El titulo de la tarea es necesario"]
        },
        tasks:[{
            type:String,
            ref:"Task",
            validate:{
                validator:
                    function(v:any[]){
                        return v.length>30?false:true
                    },
                message:"Solo puedes añadir 30 tareas a la lista"
            }
            
        }],
        createdAt: {
            type:Date,
            default: moment().toDate()
        },
        createdBy:{
            type:String,
            ref:"User",
            required:true
        }   
    }
);


list_schema.pre<ITaskList>("remove",async function(next){

   
    let deletedTasks = await Task.deleteMany({_id: { $in: this.tasks } })
    let deletedtReminders = await Reminder.deleteMany({idTask: { $in: this.tasks } });
    if(deletedTasks && deletedTasks.ok  &&  deletedtReminders && deletedTasks.ok){
        next();
    }else{
        throw new Error("Ha ocurrido un error inesperado, intentelo de nuvo mas tarde ");
    }

})


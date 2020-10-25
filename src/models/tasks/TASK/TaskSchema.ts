import moment from "moment";
import { Schema } from "mongoose";
import { ITaskList } from "../../lists/LIST/ITaskList";
import TaskList from "../../lists/LIST/TaskList";
import Reminder from "../../reminders/Reminder";
import { options } from "./DiscriminatorOptions";
import { ITask } from "./ITask";


const REMINDERS = 5;

export const task_schema = new Schema(
    {
        goal: {
            type:String,
            minlength:3,
            maxlength:75,
            trim:true,
            required:[true, "La tarea necesita un titulo"]
        },
        description:{
            type:String,
            minlength:3,
            trim:true
        },
        createdAt: {
            type:Date,
            default:moment().toDate()
        },
        archivementDateTime: {
            type:Date,
            required:true
        },
        idTasklist:{
            type:Schema.Types.ObjectId,
            ref:"TaskList"
        },
        createdBy:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        status: {
            type:String,
            enum:["PENDING","COMPLETED","FAIL"],
            required:true,
            default:"PENDING"
        },
        reminders:{
            type:[Schema.Types.ObjectId],
            ref:"Reminder",
            required:true
        },
        contributors:{
            type:[Schema.Types.ObjectId],
            ref:"User",
            required:true
        }
    },options
);

task_schema.pre<ITask>("save",async function (next) {
    
    if(this.idTasklist){
        let tl:ITaskList|null= await TaskList.findById(this.idTasklist);
        if(tl){
            tl.tasks.push(this.id);
            
            if(await tl.save()){
                next();
            }else{
                throw new Error("Algo salió mal") ;
            }
        }else{
            throw new Error("TaskList not found") ;     
        }
    }else{
        throw new Error("TaskList id is null or empty");   
    }
    
});

task_schema.pre<ITask>("remove",async function (next) {

    if(this.idTasklist){
        let tl = await TaskList.findOneAndUpdate({"_id":this.idTasklist},{ '$pull': { 'tasks': this._id } },{runValidators:true})
        let deleted = await Reminder.deleteMany({ _id: { $in: this.reminders } });
        console.log(deleted);
        console.log(tl);
        if(tl && deleted.deletedCount && deleted.deletedCount>this.reminders.length){
            next()
        }else{
            throw new Error("TaskList not found");     
        }
    }else{
        throw new Error("TaskList id is null or empty");   
    }
    
});

task_schema.pre<ITask>("validate",function(next){

    if(this.reminders.length>=0 && this.reminders.length<=REMINDERS){
        if(moment(this.createdAt).diff(this.archivementDateTime, "minutes")>-120){
            throw new Error("La fecha de finalización debe ser como mínimo de 2 horas en el futuro");
        }else{
            next();
        }
    }else{
        throw new Error("Solo puedes asignar 5 reminders a la misma tarea, solo puedes añadir "+(REMINDERS-this.reminders.length)+" más");
        
    }
    
})
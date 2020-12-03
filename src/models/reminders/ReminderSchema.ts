import moment from "moment";
import { Schema } from "mongoose";
import Task from "../tasks/TASK/Task";
import { IReminder } from "./IReminder";

export const reminder_schema = new Schema(
    {
        createdAt: {
            type:Date,
            default: moment().toDate(),
        },
        remindAt: {
            type:Date,
            required:[true, "The reminder date is needed"]
        },
        reminderData:{
            type:String,
            minlength:[10,'La longitud del mensaje debe ser de entre 10 y 45 caracteres'],
            maxlength:[45,'La longitud del mensaje debe ser de entre 10 y 45 caracteres'],
            trim:true,
            required:true
        },
        idTask:{
            type:String,
            required:true,
            ref:"Task"
        },
        createdBy:{
            type:String,
            required:true,
            ref:'User'
        }
    }
);

reminder_schema.index({remindAt: 1, idTask: 1,  },{unique: true, backgorund:true});

reminder_schema.pre<IReminder>("save",async function (next) {

    if(this.idTask){
         let t = await Task.findById(this.idTask);
        if(t){
            if(this.remindAt>t.archivementDateTime){
                throw new Error("La fecha del reminder debe ser menor que la fecha de finalización de la tarea");
            }
            if(t.reminders.length>=5){
                throw new Error("Solo 5 reminders por Tarea");
            }else{
                t.reminders.push(this.id);
                if(await t.save()){
                    next()}
                else{
                    throw new Error("Error");
                }
            }
            
        }else{
            throw new Error("No se ha encontrado esa Task");     
        }
    }else{
        throw new Error("Tienes que especificar la ID de la Task de Reminder");   
    }
    
});

reminder_schema.pre<IReminder>("remove",async function (next) {

    if(this.idTask){
         let tl = await Task.findOneAndUpdate({"_id":this.idTask},{ '$pull': { 'reminders':this._id }});
        if(tl){
            next()
        }else{
            throw new Error("No se ha encontrado esa Task");     
        }
    }else{
        throw new Error("Tienes que especificar la ID de la Task de Reminder");   
    }
    
});

reminder_schema.pre<IReminder>("validate",async function(next){

    if(moment(this.createdAt).diff(this.remindAt, "minute")>-1){
        throw new Error("La fecha del reminder debe ser 1 minuto mayor que la fecha de creación del mismo");
    }else{
        next();
    }
})
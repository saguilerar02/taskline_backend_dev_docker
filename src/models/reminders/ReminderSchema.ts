import moment from "moment";
import { Schema } from "mongoose";
import { ITask } from "../tasks/TASK/ITask";
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
            type:Schema.Types.Mixed
        },
        remindTo:{
            type: [String],
            required:true,
            validate:{
                validator:function(v:[String]):any{
                    if(v.length>0 && v.length<=10){
                        v.forEach(
                            email=>{
                                if (!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                                    throw new Error("El email no es válido");
                                }
                            }
                        )
                        return true;
                    }else{
                        throw new Error("Solo 10 se puede enviar asignar a 10 usuario o emails diferentes");
                    }
                },
                message:"Debe ser un email válido"
            }
        },
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

reminder_schema.pre<IReminder>("remove",async function (next) {

    if(this.idTask){
         let tl = await Task.findOneAndUpdate({"_id":this.idTask},{ '$pull': { 'reminders':{_id:this._id } }},{ runValidators: true });
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

    if(moment(this.createdAt).diff(this.remindAt, "minute")>-60){
        throw new Error("La fecha del reminder debe ser 1 hora mayor que la fecha de creación del mismo");
    }else{
        next();
    }
})
import moment from "moment";
import { Schema } from "mongoose";
import TaskList, { ITaskList } from "../../lists/TaskList";
import { options } from "./interfaces/DiscriminatorOptions";
import { ITask } from "./interfaces/ITask";

export const task_schema = new Schema(
    {
        goal: {
            type:String,
            min:3,
            max:45,
            trim:true,
            required:[true, "The task´s goal is needed"]
        },
        created_at: {
            type:Date,
            default: moment().toDate(),
        },
        archivement_date_time: {
            type:Date,
            validate: {
                validator: function (date:Date){
                  return moment().diff(date, "hours")<-1? true:false;
                },
                message:'The archivement date need to be more than 1 hour  on the future'
              },
        },

        id_tasklist:{
            type:Schema.Types.ObjectId,
            ref:"TaskList"
        },

        created_by:{
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
            validate:{
                validator:
                    function(v:[Schema.Types.ObjectId]){
                        return v.length>5?false:true
                    },
                message:"Only 5 reminders per task"
            }
        }
        
    },options
);

task_schema.pre<ITask>("save",async function (next) {
    
    if(this.id_tasklist){
        let tl = await TaskList.findOneAndUpdate({"_id":this.id_tasklist},{ '$push': { 'tasks': this._id } })
        if(tl){
            next();
        }else{
            next(new Error("TaskList not found")) ;     
        }
    }else{
        next(new Error("TaskList id is null or empty"));   
    }
    
});

task_schema.pre<ITask>("remove",async function (next) {

    if(this.id_tasklist){
         let tl = await TaskList.findOneAndUpdate({"_id":this.id_tasklist},{ '$pull': { 'tasks': this._id } })
        if(tl){
            next()
        }else{
            throw new Error("TaskList not found");     
        }
    }else{
        throw new Error("TaskList id is null or empty");   
    }
    
});
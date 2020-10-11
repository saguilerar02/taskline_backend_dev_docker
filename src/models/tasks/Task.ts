import moment from "moment";
import { Document, model, Schema } from "mongoose";
import { EnumType } from "typescript";
import TaskList from "../lists/TaskList";
import { goto_schema, IGotoTask } from "./GotoTask";
import meet_schema, { IMeetTask } from "./MeetTask";


export interface ITask extends Document{
    goal: String,
    created_at: Date,
    archivement_date_time: Date,
    id_tasklist: Schema.Types.ObjectId,
    created_by:Schema.Types.ObjectId,
    status: EnumType,
    contributors:[Schema.Types.ObjectId]

    reminders:[Schema.Types.ObjectId]
}
export const options=
    {
        discriminatorKey : '_taskType', 
    }

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
            default: new Date(),
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
            ref:"User"
        },
        status: {
            type:String,
            enum:["PENDING","COMPLETED","FAIL"],
            required:true,
            default:"COMPLETED"
        },
    },options
);

task_schema.pre<ITask>("save",async function (next) {
    
    if(this.id_tasklist){
        let query = await TaskList.updateOne({"_id":this.id_tasklist},{ '$push': { 'tasks': this._id } })
        if(query.n>0){
            next()
        }else{
            throw new Error("TaskList not found");     
        }
    }else{
        throw new Error("TaskList id is null or empty");   
    }
    
});

task_schema.pre<ITask>("remove",async function (next) {

    if(this.id_tasklist){
        let query = await TaskList.updateOne({"_id":this.id_tasklist},{ '$pull': { 'tasks': this._id } })
        if(query){
            next()
        }else{
            throw new Error("TaskList not found");     
        }
    }else{
        throw new Error("TaskList id is null or empty");   
    }
    
});

const Task =  model("Task", task_schema, "Tasks");

export const GotoTask = Task.discriminator<IGotoTask>("GotoTask",goto_schema,"GotoTask");
Task.discriminator<IMeetTask>("MeetTask",meet_schema,"MeetTask");

export default Task;
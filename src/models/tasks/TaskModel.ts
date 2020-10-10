import moment from "moment";
import { model, Schema } from "mongoose";
import { EnumType } from "typescript";
import { goto_schema, IGotoTask } from "./GotoTaskModel";
import meet_schema, { IMeetTask } from "./MeetModel";


export interface ITask extends Document{
    goal: String,
    creation_date: Date,
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
        creation_date: {
            type:Date,
            default: new Date(),
        },
        archivement_date_time: {
            type:Date,
            required:[true,"The archivement date is needed"],
            validate: {
                validator: function (date:Date){
                  return moment().diff(date, "hours")<-1? true:false;
                },
                message:'The archivement date need to be more than 1 hour  on the future'
              },
        },
        id_tasklist: Schema.Types.ObjectId,
        created_by:Schema.Types.ObjectId,

        status: {
            type:String,
            enum:["PENDING","COMPLETED","FAIL"],
            required:true,
            default:"COMPLETED"
        },
    },options
);



const Task =  model("Task", task_schema, "tasks");

Task.discriminator<IGotoTask>("GotoTask",goto_schema,"GotoTask");
Task.discriminator<IMeetTask>("MeetTask",meet_schema,"MeetTask");

export default Task;
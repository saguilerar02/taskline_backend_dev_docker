import { model, Schema } from "mongoose";
import { EnumType } from "typescript";


export interface IReminder extends Document{

    remind_at: Date,
    reminder_data:any
    remind_to:[String] //emails
    status: EnumType
}

export const reminder_schema = new Schema(
    {
        remind_at: {
            type:Date,
            required:[true, "The reminder date is needed"]
        },
        reminder_data:{
            type:Schema.Types.Mixed
        },
        remind_to:[{
            type: String,
            match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ,'Invalid email'],
            required:true,}],
        status: {
            type:String,
            enum:["PENDING","COMPLETED","FAIL"],
            required:true,
            default:"PENDING"
        },
    }
);



const Reminder =  model("Reminder", reminder_schema, "reminders");


export default Reminder;
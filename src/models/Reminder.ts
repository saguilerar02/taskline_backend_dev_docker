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
    }
);



const Reminder =  model("Reminder", reminder_schema, "reminders");


export default Reminder;
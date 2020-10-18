import { EnumType } from "typescript";
import {Document} from "mongoose"

export interface IReminder extends Document{

    remind_at: Date,
    reminder_data:any
    remind_to:[String] //emails
    status: EnumType
}
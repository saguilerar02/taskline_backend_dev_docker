import { EnumType } from "typescript";
import {Document, Schema} from "mongoose"

export interface IReminder extends Document{

    remindAt: Date,
    reminderData:any
    remindTo:[String] //emails
    status: EnumType
    idTask:Schema.Types.ObjectId
}
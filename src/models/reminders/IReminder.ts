import { EnumType } from "typescript";
import {Document, Schema} from "mongoose"

export interface IReminder extends Document{

    remindAt: Date,
    reminderData:any
    status: EnumType
    idTask:Schema.Types.ObjectId
    createdAt:Date
}
import { Document } from "mongoose";

export interface IReminder extends Document{

    remindAt: Date,
    reminderData:String
    reminded: Boolean
    idTask:String
    createdAt:Date
    createdBy:String
}
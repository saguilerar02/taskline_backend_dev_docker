import { Schema, Document } from "mongoose";
import { IReminder } from "../../reminders/IReminder";


export interface ITask extends Document{
    goal: String,
    description: String,
    archivementDateTime: Date,
    createdAt: Date,
    idTasklist: String,
    createdBy:String,
    status: String,
    contributors:[String],
    reminders:Array<IReminder>
}
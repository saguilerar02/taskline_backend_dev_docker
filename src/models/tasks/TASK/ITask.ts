import { Schema, Document } from "mongoose";
import { EnumType } from "typescript";
import { IReminder } from "../../reminders/IReminder";


export interface ITask extends Document{
    goal: String,
    description: String,
    archivementDateTime: Date,
    createdAt: Date,
    idTasklist: Schema.Types.ObjectId,
    createdBy:Schema.Types.ObjectId,
    status: EnumType,
    contributors:[Schema.Types.ObjectId],
    reminders:Array<IReminder>
}
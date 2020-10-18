import { Schema, Document } from "mongoose";
import { EnumType } from "typescript";
import { IReminder } from "../../../reminders/IReminder";


export interface ITask extends Document{
    goal: String,
    created_at: Date,
    archivement_date_time: Date,
    id_tasklist: Schema.Types.ObjectId,
    created_by:Schema.Types.ObjectId,
    status: EnumType,
    contributors:[Schema.Types.ObjectId],
    reminders:Array<IReminder>
}
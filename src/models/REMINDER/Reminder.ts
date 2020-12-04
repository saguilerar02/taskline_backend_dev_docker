import { model } from "mongoose";
import { IReminder } from "./IReminder";
import { reminder_schema } from "./ReminderSchema";

const Reminder =  model<IReminder>("Reminder", reminder_schema, "reminders");


export default Reminder;
import { model } from "mongoose";
import { reminder_schema } from "./ReminderSchema";

const Reminder =  model("Reminder", reminder_schema, "reminders");


export default Reminder;
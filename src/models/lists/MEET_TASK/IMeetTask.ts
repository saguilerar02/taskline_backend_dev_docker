import { Schema } from "mongoose";
import { ITask } from "../../tasks/TASK/interfaces/ITask";

export interface IMeetTask extends Document,ITask{
    partners:[Schema.Types.ObjectId],
    meet_itinerary:Schema.Types.ObjectId
}
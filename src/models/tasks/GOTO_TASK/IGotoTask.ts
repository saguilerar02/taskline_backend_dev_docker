import { Schema } from "mongoose";
import { ITask } from "../TASK/interfaces/ITask";

export interface IGotoTask extends Document,ITask{
    site:{
            name: String,
            location: Schema.Types.Mixed
        }
    partners:[Schema.Types.ObjectId]

}
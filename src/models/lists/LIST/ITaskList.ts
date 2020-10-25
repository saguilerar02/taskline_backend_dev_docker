import { Document,Schema } from "mongoose";

export interface ITaskList extends Document{

    name: String,
    tasks:[Schema.Types.ObjectId]
    createdAt:Date,
    createdBy:Schema.Types.ObjectId
}
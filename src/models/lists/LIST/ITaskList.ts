import { Document,Schema } from "mongoose";

export interface ITaskList extends Document{

    name: String,
    tasks:[String]
    createdAt:Date,
    createdBy:String
}
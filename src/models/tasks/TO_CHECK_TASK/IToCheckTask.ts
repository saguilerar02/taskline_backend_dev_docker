import { ITask } from "../TASK/interfaces/ITask";

export interface IToCheckTask extends Document,ITask{
    items:[{
        name:String,
        quantity:Number,
        done:Boolean
    }]
}
import { ITask } from "../TASK/ITask";
import {Document} from 'mongoose'

export interface IToCheckTask extends Document,ITask{
    items:[{
        name:String,
        quantity:Number,
        done:Boolean
    }]
}


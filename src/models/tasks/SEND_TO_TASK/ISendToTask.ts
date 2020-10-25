import { ITask } from "../TASK/ITask";
import { Document} from 'mongoose'

export interface ISendToTask extends Document,ITask{
    sendTitle:String
    sendBody:String
    sendBlobURL:String
}
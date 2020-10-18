import { ITask } from "../TASK/interfaces/ITask";

export interface ISendToTask extends Document,ITask{
    
    receivers:[String]
}
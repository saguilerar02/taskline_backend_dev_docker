import { model } from "mongoose";
import { ITask } from "./ITask";
import { task_schema } from "./TaskSchema";



const Task =  model<ITask>("Task", task_schema, "tasks");

export default Task;
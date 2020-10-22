import { model } from "mongoose";
import { goto_schema } from "../GOTO_TASK/GotoTaskSchema";
import { task_schema } from "./TaskSchema";
import { IGotoTask } from "../GOTO_TASK/IGotoTask";
import { sendToTaskSchema } from "../SEND_TO_TASK/SendToTaskSchema";
import { ISendToTask } from "../SEND_TO_TASK/ISendToTask";
import { toCheckTaskSchema } from "../TO_CHECK_TASK/ToCheckSchema";
import { IToCheckTask } from "../TO_CHECK_TASK/IToCheckTask";



const Task =  model("Task", task_schema, "tasks");

export const GotoTask = Task.discriminator<IGotoTask>("GotoTask",goto_schema,"GotoTask");
export const ToCheckTask = Task.discriminator<IToCheckTask>("ToCheckTask",toCheckTaskSchema,"ToCheckTask");
export const SendToTask = Task.discriminator<ISendToTask>("SendToTask",sendToTaskSchema,"SendToTask");



export default Task;
import { model } from "mongoose";
import { ITaskList } from "./ITaskList";
import { list_schema } from "./TaskListSchema";


const TaskList =  model<ITaskList>("TaskList", list_schema, "lists");
export default TaskList;
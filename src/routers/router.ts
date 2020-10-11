import {Router} from 'express'
import { deleteOneTask, saveTask, updateTask } from '../controllers/TaskController';
import { deleteOneTaskList, saveTaskList, updateTaskList } from '../controllers/TaskListsController';


const router = Router();


router.post("/task/create", saveTask);

router.put("/task/update/:id", updateTask);

router.delete("/task/delete/:id", deleteOneTask);

router.post("/list/create", saveTaskList);

router.put("/list/update/:id", updateTaskList);

router.delete("/list/delete/:id", deleteOneTaskList);

export default router;

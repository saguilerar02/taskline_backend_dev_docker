import {Router} from 'express'
import { deleteOneReminder, updateReminder } from '../controllers/ReminderController';
import { deleteOneTask, saveTask, updateTask } from '../controllers/TaskController';
import { deleteOneTaskList, saveTaskList, updateTaskList } from '../controllers/TaskListsController';
import { signIn, signUp } from '../controllers/UserController';


const router = Router();


router.post("/task/create", saveTask);

router.put("/task/update/:id", updateTask);

router.delete("/task/delete/:id", deleteOneTask);

router.post("/list/create", saveTaskList);

router.put("/list/update/:id", updateTaskList);

router.delete("/list/delete/:id", deleteOneTaskList);

router.put("/reminder/update/:id", updateReminder);

router.delete("/reminder/delete/:id", deleteOneReminder);

router.post("/signup",signUp);
router.post("/signin",signIn);

export default router;

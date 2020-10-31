import { Router } from 'express';
import { deleteOneReminder, saveReminder } from '../controllers/ReminderController';
import { deleteOneTask, saveTask, showTimeLine, updateTask } from '../controllers/TaskController';
import { deleteOneTaskList, getUserLists, saveTaskList, updateTaskList } from '../controllers/TaskListsController';
import { resetUserPassword, sendMailResetPassword, signIn, signUp } from '../controllers/UserController';


const router = Router();

//TASK

router.post("/task/create", saveTask);

router.put("/task/update/:id", updateTask);

router.delete("/task/delete/:id", deleteOneTask);

router.get("/timeline/:user/:last?",showTimeLine);
router.get("/lists/:user",getUserLists);


//LISTS
router.post("/list/create", saveTaskList);

router.put("/list/update/:id", updateTaskList);

router.delete("/list/delete/:id", deleteOneTaskList);

//REMINDER
router.post("/reminder/create", saveReminder);


router.delete("/reminder/delete/:id", deleteOneReminder);

//USER

router.post("/signup",signUp);
router.post("/signin",signIn);
router.post("/resetpassword",sendMailResetPassword);
router.post("/resetpassword/:user/:token",resetUserPassword);

export default router;


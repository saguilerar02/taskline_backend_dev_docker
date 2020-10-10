import {Router, Response,Request} from 'express'
import {deleteOne, saveTask, update} from '../controllers/TaskController'

const router = Router();


router.post("/create", saveTask);

router.put("/update/:id", update);

//router.get("/get_tasks_of/:id_list", getByList);

router.delete("/delete/:id", deleteOne);

export default router;

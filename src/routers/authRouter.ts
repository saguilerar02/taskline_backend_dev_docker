import { Router } from "express";
import jsonwebtoken from 'jsonwebtoken'
import { saveReminder, deleteOneReminder } from "../controllers/ReminderController";
import { saveTask, updateTask, deleteOneTask, showTimeLine } from "../controllers/TaskController";
import { getUserLists, saveTaskList, updateTaskList, deleteOneTaskList } from "../controllers/TaskListsController";
const authRouter = Router();

authRouter.use(async function (req, res, next) {
    try{
        let header = req.headers["authorization"];
        let token =header && header.split(" ")[1];
        
        if(token){
            let verified = jsonwebtoken.verify(token,process.env.PUBLIC_KEY as string,{ 
                issuer:'taskline',
                audience:'https://beermaginary.com'
            });
            if(!verified)res.sendStatus(403);
            next();
        }else{
            return res.status(401);
        }
    }catch(err){
        console.log(process.env.PUBLIC_KEY );
        console.log(err);
        return res.status(500);
    }
  });

authRouter.post("/task/create", saveTask);

authRouter.put("/task/update/:id", updateTask);

authRouter.delete("/task/delete/:id", deleteOneTask);

authRouter.get("/timeline/:user/:last?",showTimeLine);
authRouter.get("/lists/:user",getUserLists);

//LISTS
authRouter.post("/list/create", saveTaskList);

authRouter.put("/list/update/:id", updateTaskList);

authRouter.delete("/list/delete/:id", deleteOneTaskList);

//REMINDER
authRouter.post("/reminder/create", saveReminder);


authRouter.delete("/reminder/delete/:id", deleteOneReminder);

export default authRouter;
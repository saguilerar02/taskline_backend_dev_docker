import { Router } from "express";
import jsonwebtoken from 'jsonwebtoken'
import { saveReminder, deleteOneReminder } from "../controllers/ReminderController";
import { saveTask, updateTask, deleteOneTask, showTimeLine } from "../controllers/TaskController";
import { getUserLists, saveTaskList, updateTaskList, deleteOneTaskList } from "../controllers/TaskListsController";
import { getUserProfile, updateUser } from "../controllers/UserController";
import { uploadImageProfileImage } from "../services/MulterConfig";
import {Request,Response, NextFunction} from 'express'
const authRouter = Router();

const jwt = async function (req:Request, res:Response, next:NextFunction) {
    try{
        let header = req.headers["authorization"];
        let token =header && header.split(" ")[1];
        
        if(token){
            let verified = jsonwebtoken.verify(token,process.env.PUBLIC_KEY as string,{ 
                issuer:'taskline',
                audience:'https://beermaginary.com'
            }) as any;
            if(!verified)res.status(403).send("Bad token");
            req.user = verified.user
            next();
        }else{
            next(new Error("BAD TOKEN"));
        }
    }catch(err){
        next(new Error("BAD TOKEN"));
    }
  };

authRouter.post("/task/create",jwt, saveTask);

authRouter.put("/task/update/:id",jwt, updateTask);

authRouter.delete("/task/delete/:id",jwt, deleteOneTask);

authRouter.get("/timeline/:last?",jwt,showTimeLine);


//LISTS
authRouter.post("/list/create",jwt, saveTaskList);

authRouter.put("/list/update/:id",jwt, updateTaskList);

authRouter.delete("/list/delete/:id",jwt, deleteOneTaskList);

authRouter.get("/lists",jwt,getUserLists);

//REMINDER
authRouter.post("/reminder/create",jwt, saveReminder);


authRouter.delete("/reminder/delete/:id",jwt, deleteOneReminder);

//USER

authRouter.get("/profile",jwt, getUserProfile)
authRouter.put("/profile",jwt, uploadImageProfileImage.single('profileImage'))

export default authRouter;
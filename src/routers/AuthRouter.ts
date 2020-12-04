import { Request, Response, Router } from "express";
import jsonwebtoken from 'jsonwebtoken';
import { deleteOneReminder, saveReminder } from "../controllers/ReminderController";
import { deleteOneTask, saveTask, showTimeLine, updateTask } from "../controllers/TaskController";
import { deleteOneTaskList, getUserLists, saveTaskList, updateTaskList } from "../controllers/TaskListsController";
import { changeProfileImage, getUserDTO, getUserProfile, getUsersByFilter, updateUser } from "../controllers/UserController";
import { uploadImageProfileImage } from "../services/MulterConfig";
const authRouter = Router();

authRouter.use(async function (req:Request, res:Response, next) {
    try{
        let header = req.headers["authorization"];
        let token =header && header.split(" ")[1];
        if(token){
            let verified = jsonwebtoken.verify(token,process.env.PUBLIC_KEY as string,{ 
                issuer:'taskline',
                audience:'https://beermaginary.com'
            }) as any;
            if(!verified)res.status(403).send({error:"Su token de autenticación es inválido o ha caducado"});
            req.user = verified.user
            next();
        }else{
            res.status(403).send({error:"Su token de autenticación es inválido o ha caducado"});
        }
    }catch(err){
        res.status(403).send({error:"Su token de autenticación es inválido o ha caducado"});
    }
  });

authRouter.post("/task/create", saveTask);

authRouter.put("/task/update/:id", updateTask);

authRouter.delete("/task/delete/:id", deleteOneTask);

authRouter.get("/timeline/:last?/:lastDate?",showTimeLine);


//LISTS
authRouter.post("/list/create", saveTaskList);

authRouter.put("/list/update/:id", updateTaskList);

authRouter.delete("/list/delete/:id", deleteOneTaskList);

authRouter.get("/lists",getUserLists);

//REMINDER
authRouter.post("/reminder/create", saveReminder);


authRouter.delete("/reminder/delete/:id", deleteOneReminder);

//USER

authRouter.get("/profile", getUserProfile);
authRouter.put("/profile", updateUser);
authRouter.put("/upload", uploadImageProfileImage,changeProfileImage);
authRouter.get("/userDTO", getUserDTO)
authRouter.get("/users/:username", getUsersByFilter)

export default authRouter;
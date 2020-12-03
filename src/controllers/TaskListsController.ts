import { Request, Response } from 'express';
import { responseErrorMaker } from '../handlers/ErrorHandler';
import { ITaskList } from '../models/lists/LIST/ITaskList';
import TaskList from '../models/lists/LIST/TaskList';
import Reminder from '../models/reminders/Reminder';
import { ITask } from '../models/tasks/TASK/ITask';

export const saveTaskList = async function (request: Request, res: Response) {

    if (request.body && Object.keys(request.body).length > 0) {
        try {
            request.body.createdBy = request.user;
            let t = new TaskList(request.body);
            if (await t.save()) {
                res.status(201).send({type:"SUCCESS", list:t,msg: "La lista se ha guardado con éxito" });
            } else {
                res.status(500).send({type:"ERROR",  error: "Ha ocurrido un error al intentar guardar la Lista, inténtelo de nuevo más  tarde" });
            }

        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send({type:"VALIDATION_ERROR",  error: responseErrorMaker(err)});
            } else {
                res.status(500).send({type:"ERROR",  error: err.message });
            }
        }
    } else {
        res.status(400).send({type:"ERROR",  error: "Bad Request: petición inválida"});
    }

};

export const deleteOneTaskList = async function (request: Request, res: Response) {

    if (request.params["id"] && request.params["id"].length > 0) {
        try {

            let t = await TaskList.findOne({_id:request.params["id"], createdBy:request.user});
            if (t) {
                if ( await t.remove()) {
                    res.status(200).send({type:"SUCCESS",msg:"La lista se ha borrado con éxito" });
                } else {
                    res.status(500).send({type:"ERROR",  error:"No se ha podido borrar la lista, intentelo de nuevo más tarde" });
                }
            } else {
                res.status(404).send({type:"ERROR",  error: "La lista especificada no se encontró" });
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send({type:"VALIDATION_ERROR", error: responseErrorMaker(err) });
            } else {
                if(err.code === 11000){
                    res.status(500).send({type:"ERROR", error: 'La tarea tiene la misma fecha de realización que otra, por favor introduzca una fecha distinta' });
                }
                res.status(500).send({type:"ERROR", error: err.message });
            }
        }
    } else {
        res.status(400).send("Bad Request: petición inválida");
    }
};


export const updateTaskList = async function (req: Request, res: Response) {

    if (req.body && Object.keys(req.body).length > 0 && req.params["id"]) {
        try {

            let t = await TaskList.findOne({_id:req.params["id"],createdBy:req.user});
            if(t){
               let updated = await t.updateOne(req.body,{runValidators:true});
                if (updated && updated.nModified>0) {
                    res.status(200).send({type:"SUCCESS",msg: "La lista se ha actualizado con éxito" });
                } else {
                    res.status(404).send({type:"ERROR", error: "Ha ocurrido un error inesperado, intentelo de nuevo más tarde" });
                }
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(422).send({type:"VALIDATION_ERROR",error:responseErrorMaker(err)});
            } else {
                res.status(500).send({type:"ERROR",error: "Ha ocurrido un error inesperado, intentelo de nuevo más tarde" });
            }
        }
    } else {
        res.status(400).send({type:"ERROR",error: "Bad Request: petición inválida"});
    }
}

export const getUserLists = async function (req: Request, res: Response) {

    if(req.user){
        try {
            let lists:ITaskList[]|null;
            lists = await TaskList.find({ createdBy: req.user});
    
            if (lists && lists.length > 0) {
                res.status(200).send({type:"SUCCESS", lists: lists });
            } else {
                res.status(404).send({type:"ERROR", error: "Aún no has creado ninguna lista" });
            }
        } catch (err) {
    
            res.status(500).send({type:"ERROR", error: 'Algo salió mal, intentelo de nuevo más tarde' });
            console.error(err);
        }
    }else{
        res.status(400).send({type:"ERROR", error:"Bad Request: petición inválida"});
    }
   
}

export const getOneList = async function (req: Request, res: Response) {

    if (req.params && req.params['idList']) {
        try {
            let list: ITaskList|null;
                list = await TaskList.findById(req.params['idList'])
                .sort({ archivementDateTime: 1, _id:1 })
                .populate(
                    {
                        path:'tasks',
                        model:'Task',
                        populate:[
                            {
                                path:'contributors',
                                model:"User",
                                select:'username name profileImage _id',
                            },
                            {
                                path:'reminders',
                                model:'Reminder',
                            }
                        ]  
                    }
                )
                if (list) {
                    res.status(200).send({type:'SUCCESS', list: list });
                } else {
                    res.status(404).send({type:"ERROR", error: "No se encontro la lista especificada" });
                }
        } catch (err) {
            //console.log(err)
            res.status(500).send({type:"ERROR", error:  "Ha ocurrido un error inesperado, inténtelo de nuevo más  tarde" });
        }
    
    } else{
        res.status(400).send({ error: "Bad Request: La peticion está inválida"});
    }

}
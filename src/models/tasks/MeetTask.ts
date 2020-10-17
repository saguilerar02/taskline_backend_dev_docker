import { Document, Schema } from "mongoose";
import TaskList from "../lists/TaskList";
import { ITask, options } from "./Task";


export interface IMeetTask extends Document,ITask{
    partners:[Schema.Types.ObjectId],
    meet_itinerary:Schema.Types.ObjectId
}

const meet_schema = new Schema({
    partners:{
        type:[Schema.Types.ObjectId],
        default:undefined,
        required:true
    },
    date_itinerary:Schema.Types.ObjectId
},options);

meet_schema.pre<IMeetTask>("remove",async function (next) {

    if(this.meet_itinerary){
        let query = await TaskList.deleteOne({"_id":this.meet_itinerary});
        if(query.ok && query.deletedCount && query.deletedCount>0){
            next()
        }else{
            throw new Error("Impossible to delete this task, try again later");     
        }
    }else{
        throw new Error("No tasklist referenced");   
    }
});

export default meet_schema;




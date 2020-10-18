import { Schema } from "mongoose";
import TaskList from "../TaskList";
import { goto_schema } from "../../tasks/GOTO_TASK/GotoTaskSchema";
import { options } from "../../tasks/TASK/interfaces/DiscriminatorOptions";
import { IMeetTask } from "./IMeetTask";


/*

const meet_schema = new Schema({
    
    meet_itinerary:{
        type:Schema.Types.ObjectId,
        ref:"Task"
    }

},options);

meet_schema.add(goto_schema);

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

*/


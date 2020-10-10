import { Document, Schema } from "mongoose";
import Itinerary from "../lists/Itinerary";
import { ITask, options } from "./TaskModel";


export interface IMeetTask extends Document,ITask{
    partners:[Schema.Types.ObjectId],
    date_itinerary:Schema.Types.ObjectId
}

const meet_schema = new Schema({
    partners:{
        type:[Schema.Types.ObjectId],
        default:undefined,
        required:true
    },
    date_itinerary:Schema.Types.ObjectId
},options);

meet_schema.pre<IMeetTask>("findOneAndDelete",async function (next) {
    
    try {
        if(await Itinerary.findByIdAndDelete(this.date_itinerary)){
            return next();
        }
        else{
            throw Error();
        }
    } catch (error) {
        throw error;
    }
})

export default meet_schema;




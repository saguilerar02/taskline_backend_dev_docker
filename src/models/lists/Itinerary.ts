import { Schema, model } from "mongoose";

export const itinerary_schema = new Schema(
    {
        title: {
            type:String,
            min:3,
            max:45,
            trim:true,
            required:[true, "The lists´s title is needed"]
        },
        tasks:{
            type:[Schema.Types.ObjectId]
        }
    }
);

const Itinerary =  model("Itinerary", itinerary_schema, "tasks-lists");
export default Itinerary;
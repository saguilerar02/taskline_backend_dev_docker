import { Document, Schema } from "mongoose";
import { ITask } from "./TaskModel";


export interface IGotoTask extends Document,ITask{
    site:{
            name: String,
            location: Schema.Types.Mixed
        }

}

export const goto_schema = new Schema({
    site:{
        name: String,
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    }
});





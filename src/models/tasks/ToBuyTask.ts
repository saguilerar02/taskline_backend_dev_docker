import { Document, Schema } from "mongoose";
import { ITask } from "./TaskModel";


export interface IToBuyTask extends Document,ITask{
    products:[{
        name:String,
        quantity:Number,
        purchased:Boolean
    }]
}


export const to_buy_schema = new Schema({
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





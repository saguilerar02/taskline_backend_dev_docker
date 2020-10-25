import { Schema } from "mongoose";

export const goto_schema = new Schema({
    site:{
        name:{
            type:String,
            required:[true,"The site name is required"]
        },
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





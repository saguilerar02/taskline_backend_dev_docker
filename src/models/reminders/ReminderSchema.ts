import { Schema } from "mongoose";

export const reminder_schema = new Schema(
    {
        remind_at: {
            type:Date,
            required:[true, "The reminder date is needed"]
        },
        reminder_data:{
            type:Schema.Types.Mixed
        },
        remind_to:{
            type: [String],
            match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ,'Invalid email'],
            required:true,},
        reminded:{
            type:Boolean,
            default:false
        },
        id_task:{
            type:Schema.Types.ObjectId,
            required:true
        }
    }
);
/*
reminder_schema.pre("remove",async function(){

    this.
});
*/
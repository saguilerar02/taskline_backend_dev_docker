import moment from "moment";
import { Schema } from "mongoose";
import { IUser } from "./IUser";
import bcrypt from 'bcrypt'

export let user_schema = new Schema({

    email:{
        type:String,
        //http://emailregex.com/ 20/07/2020 Javascript Regex
        match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ,'Invalid email'],
        required:[true,'Email is required'],
        unique:true,
        trim:true,
        index:true
    },
    username:{
        type:String,
        match:[/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/,'Invalid username'],
        unique:true,
        trim: true,
        index:true
      },
    password:{
      type: String,
      required:[true, 'Password is required'],
      minlength:[12,"La contraseña es demasiado corta"]
    },
    name:{
      type:String,
      match:[/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/,'Invalid username'],
      required:[true, 'Name is required'],
      trim: true,
    },
    phoneNumber:{
      type:String,
      match:[/^(\+34|0034|34)?[6789]\d{8}$/,'Invalid phone number'],
      trim: true,
    },
    birthDate:{
      type:Date,
      validate: {
        validator: function (date:Date){
          return moment().diff(date, "year")<-5? true:false;
        },
        message:'The birthdate date need to be more than 5 years  on the past'
      },
    },
    active:{
      type:Boolean,
      default:true
    },
    createdAt:{
      type:Date,
      default:moment().toDate()
    }
}); 
import {Document, Schema, Model, model } from 'mongoose'
import moment from 'moment'
import bcrypt from 'bcrypt';

export interface IUser extends Document{

    email:String,
    username:String,
    password:String,
    name:String,
    phone_number:String,
    birth_day:Date,
    is_active:Boolean,
}

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
        required:[true, 'Password is required']
      },
      name:{
        type:String,
        match:[/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/,'Invalid username'],
        required:[true, 'Name is required'],
        trim: true,
      },
      phone_number:{
        type:String,
        match:[/^(\+34|0034|34)?[6789]\d{8}$/,'Invalid phone number'],
        trim: true,
      }
}); 


user_schema.pre<IUser>("save", async function(next) {

  if (this.isNew){
    this.password =await bcrypt.hash(this.password, 10);
  }
    next();
});

const User = model<IUser>('User', user_schema, "users");
export default  User;
import {Document} from 'mongoose'

export interface IUser extends Document{

    email:String
    username:String
    password:String
    name:String
    phoneNumber:String
    birth_day:Date
    active:Boolean
    createdAt:Date
    profileImage:String
}
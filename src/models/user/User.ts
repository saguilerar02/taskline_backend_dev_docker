import {Document, Schema, Model, model } from 'mongoose'
import moment from 'moment'
import bcrypt from 'bcrypt';
import { IUser } from './IUser';
import { user_schema } from './UserSchema';



const User = model<IUser>('User', user_schema, "users");
export default  User;
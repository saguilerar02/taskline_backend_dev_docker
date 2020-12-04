import { model } from 'mongoose';
import { IUser } from './IUser';
import { user_schema } from './UserSchema';



const User = model<IUser>('User', user_schema, "users");
export default  User;
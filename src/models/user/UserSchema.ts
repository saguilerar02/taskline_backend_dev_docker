import moment from "moment";
import { Schema } from "mongoose";
import { encriptarPassword } from "../../services/Bcrypter";
import { IUser } from "./IUser";

export let user_schema = new Schema({

    email:{
        type:String,
        //http://emailregex.com/ 20/07/2020 Javascript Regex
        match:[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ,'El email es invalido'],
        required:[true,'El email es necesario'],
        unique:true,
        trim:true,
        index:true
    },
    username:{
        type:String,
        match:[/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/,'Nombre de usuario inválido, debe tener una longitud de 3 a 29 caracteres'],
        unique:true,
        trim: true,
        index:true
      },
    password:{
      type: String,
      required:[true, 'La contraseña es imprescindible'],
      minlength:[12,"La contraseña es demasiado corta minimo 12 caracteres"]
    },
    name:{
      type:String,
      match:[/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/,'Caracteres invalidos en su nombre'],
      required:[true, 'El nombre es necesario'],
      trim: true,
    },
    phoneNumber:{
      type:String,
      match:[/^(\+34|0034|34)?[6789]\d{8}$/,'El número de teléfono es invalido'],
      trim: true,
    },
    birthDate:{
      type:Date,
      validate: {
        validator: function (date:Date){
          return moment().diff(date, "year")>5? true:false;
        },
        message:'La fecha de nacimiento debe ser como mínimo de 5 años en el pasado'
      },
    },
    active:{
      type:Boolean,
      default:true
    },
    createdAt:{
      type:Date,
      default:moment().toDate()
    },
    profileImage:{
      type:String,
      trim:true,
      default:process.env.DEFAULT_USER_IMAGE
    }
}); 

user_schema.pre<IUser>("save", async function(next) {

  if (this.isNew){
    this.password =await encriptarPassword(this.password.toString());
  }
    next();
});
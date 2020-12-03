import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { IUser } from '../models/user/IUser';


let mailer:Mail;

export const createTransporter = function(){
   mailer= nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILERACCOUNT,
      pass: process.env.MAILERPASSWORD,
    }
  });
}


export async function sendReminderEmail(reminder:any) {
    try{
        let info = await mailer.sendMail({
          from: process.env.MAILERACCOUNT,
          to: reminder.idTask.contributors.map(
            (contributor:IUser,i:number,array:[])=>{return contributor.email+','}
          )+reminder.createdBy.email, 
          subject: `#REMINDER:${reminder.id} -Recuerda que tienes algo por hacer `, 
          html: "<h2>"+reminder.reminderData+"</h2>",
        });
       return info;
    }catch(err){
        console.log(err);
    }
}

export async function sendResetPasswordEmail(user:IUser,token:string) {
  try{
      let info = await mailer.sendMail({
        from: process.env.MAILERACCOUNT,
        to:user.email as string,
        subject: "#RESET PASSWORD:Vamos a resetear tu password ", 
        html:'<a href="http://localhost:4200/reset_password/' + user.id + '/' + token + '">Reset password</a>',
      });
     return info;
  }catch(err){
      console.log(err);
  }
}

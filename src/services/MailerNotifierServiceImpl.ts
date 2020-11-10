import { CronJob } from 'cron';
import moment from 'moment';
import Reminder from '../models/reminders/Reminder';
import { sendReminderEmail } from './Mailer';

export const job = new CronJob('0 * * * * *', async function() {
    try{
        let reminders:any[]|null = await Reminder
                                        .find({"remindAt":{$lte:moment().add(30,'minutes').toDate()},"reminded":false})
                                        .populate({
                                            path:'idTask',
                                            model:'Task',
                                            select:'contributors -_id',
                                            populate:{
                                                path:'contributors',
                                                model:"User",
                                                select:'email -_id'
                                            }
                                        })
                                        .populate({
                                            path:'createdBy',
                                            model:'User',
                                            select:'email -_id',
                                        })
        if(reminders && reminders.length>0){
            reminders.forEach(async rem => {
                if(rem.idTask.contributors && rem.idTask.contributors.length>0){
                    if(sendReminderEmail(rem)){
                        rem.depopulate();
                        await rem.delete();
                    }
                    
                }
            });
            console.log("Todos los emails han sido recordados con éxito")
        }else{
            console.log("No había ningun reminder");
        }
    }catch(err){
        console.log(err);
    }
});


import { CronJob } from 'cron';
import moment from 'moment';
import Reminder from '../models/REMINDER/Reminder';
import { sendReminderEmail } from './Mailer';

export const job = new CronJob('0 * * * * *', async function() {
    try{
        let reminders:any[]|null = await Reminder
                                        .find({remindAt:{$lte:moment().add(5,'minutes').toDate()}})
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
                if(await sendReminderEmail(rem)){
                    rem.depopulate();
                    await rem.delete();
                }
            });
            console.log("Todos los emails han sido recordados con éxito")
        }
    }catch(err){
        console.log(err);
    }
});


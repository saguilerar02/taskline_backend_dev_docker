import nodemailer from 'nodemailer'
import { CronJob } from 'cron'
import Reminder from '../models/reminders/Reminder';
import moment from 'moment';



export const job = new CronJob('0 * * * * *', function() {
	const d = new Date();
    console.log('Every Tenth Minute:', d);
    
    let minute_start = moment().startOf('minute').add(1,'h')

    //let reminders = Reminder.find({"remind_at": {"$gte": moment().add(1,'h'), "$lt": new Date(2012, 7, 15)}});
    console.log('Holi')
    //console.log(reminders);
});


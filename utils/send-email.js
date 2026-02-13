import dayjs from "dayjs";
import { emailTemplates } from "./email.template.js";
import transporter, { accountEmail } from "../config/nodemailer.js";

export const sentReminderEmail = async ({ to, type, userSubscription }) => {
    if(!to || !type) {
        throw new Error('Missing required parameters');
    }

    const template = emailTemplates.find((t) => {
        return t.label === type
    });

    if(!template) throw new Error('Invalid email type');

    const mailInfo = {
        userName: userSubscription.user.name,
        subscriptionName: userSubscription.name,
        renewalDate: dayjs(userSubscription.renewalDate).format('D MMM, YYYY'),
        planName: userSubscription.name,
        price: `${userSubscription.currency} ${userSubscription.price} (${userSubscription.frequency})`,
        paymentMethod: userSubscription.paymentMethod,
    }
    
    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) return console.log(error, 'Error sending email');

        console.log('Email sent: ' + info.response);
    })
}
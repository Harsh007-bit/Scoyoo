import nodemailer from 'nodemailer';

export async function sendBookingConfirmationEmail(email, roomNumber, startTime, endTime) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_APP_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const emailTemplate = `Dear User, <br/><br/>
      Your booking has been confirmed for room ${roomNumber} from ${startTime} to ${endTime}. <br/><br/>
      Thank you for choosing our hotel. <br/><br/>
      Regards, <br/>
      Scoyo`;

  const mailOptions = {
    from: process.env.GMAIL_APP_EMAIL,
    to: email,
    subject: 'Booking Confirmation',
    html: emailTemplate
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent: ', info.messageId);

} 
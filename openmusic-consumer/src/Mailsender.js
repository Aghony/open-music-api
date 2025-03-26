const nodemailer = require('nodemailer');

class Mailsender{
  constructor() {
    this.transporter = nodemailer.creteTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  sendEmail(targerEmail, content) {
    const message = {
      from: 'Open music API',
      subject: 'Ekspor Playlist',
      text: 'Terlampir hasil dari ekspor Playlist',
      attachments: [
        {
          filament: 'palylist.json',
          content,
        },
      ],
    };

    return this.transporter.sendMail(message);
  }
}

module.exports = Mailsender;
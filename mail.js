const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/index', (req, res) => {
	const output = `
	<p>Пришла новая заявка.</p><p>Имя: ${req.body.name}</p>
	<p>Номер телефона: ${req.body.phone}</p>
	<p>Электронная почта: ${req.body.email}</p>
	<p>Дата: ${req.body.date}</p>
	<p>Время: ${req.body.time}</p>
	<p>Выбранные услуги: ${req.body.serv}</p>`;


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 't3.t3st@yandex.ru', // generated ethereal user
            pass: 'rapira15' // generated ethereal password
        },
        tls:{
        	rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Client contact" <t3.t3st@yandex.ru>', // sender address
        to: 'dianova.1981@bk.ru', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('index', {msg:'Сообщение отправлено. Ждите звонка'});

    });
});

app.listen(80);
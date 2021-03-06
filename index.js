var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const nodemailer = require("nodemailer");

app.get('/', function(req, res){
  res.send("Hi")
})

app.post('/emailOwner', function(req, res){
  if(!req.body.email || !req.body.message) return res.send('400');
  try {
      let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // send mail with defined transport object
      transporter.sendMail({
        from: 'Portfolio Website <'+process.env.EMAIL+'>', // sender address
        to: process.env.EMAIL, // list of receivers
        subject: "Message from "+req.body.email, // Subject line
        text: "Message from "+req.body.email+": "+req.body.message, // plain text body
        html: "<b>Message from "+req.body.email+":</b><br/>"+req.body.message, // html body
      }, function(error, info) {
        res.send({error: error, info: info})
      })
  } catch(e){
    return res.send({error:e})
  }
})

app.listen(process.env.PORT || 443, "0.0.0.0",() => console.log('Servicebin listening...'+process.env.PORT));
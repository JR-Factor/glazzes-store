const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid');

//server settings
app.set('port',process.env.PORT || 3000);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

//server middlewares
app.use('/public',express.static(path.join(__dirname,'public')));

const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/uploads'),
    filename:(req,file,cb,filename)=>{
        cb(null,uuid() + path.extname(file.originalname));
    }
});
app.use(multer({ storage }).single('image'));
app.use(express.urlencoded({extended: false}));

//importing routes
const routeIndex = require('./routes/index.js');

//connecting to DataBase
mongoose.connect('mongodb://JuanRM:jr071201@ds151864.mlab.com:51864/glazzes-store',{ useNewUrlParser: true })
    .then(()=>{console.log('DB is working')})
    .catch((err)=>{console.log(err)});

//starting the server
app.use('/',routeIndex);

app.listen(app.get('port'),function (){
    console.log('Server ON');
});
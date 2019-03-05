const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');

var onSession = false;

const Image = require('../models/items.js');

router.get('/',(req,res)=>{
    onSession = false;
    res.render('index');
});

router.get('/contact',(req,res)=>{
    onSession = false;
    res.render('contact');
});

router.get('/catalogue', async(req,res)=>{
    onSession = false;
    const images = await Image.find();
    res.render('catalogue',{ images });
});

router.get('/admin',async(req,res)=>{
    if(!onSession){
        const error = "";
        res.render('admin',{ error });
    }else{
        const images = await Image.find();
        res.render('admin-catalogue',{ images });
    }
});

router.get('/admin/logout',(req,res)=>{
    onSession = false;
    res.redirect('/');
});

router.post('/admin',async (req,res)=>{
    if(/^admin$/.test(req.body.admin) && /^0000$/.test(req.body.password)){
        const images = await Image.find();
        onSession = true;
        res.render('admin-catalogue',{ images });
      }
      else{
        const error = "User incorrect or password";
        res.render('admin',{ error });
      }
});

router.get('/admin/upload',(req,res)=>{
    res.render('admin-upload');
});
router.post('/admin/upload',async(req,res)=>{
    if(/jpeg|jpg|gif|png/.test(req.file.mimetype)){
        const image = new Image();
        image.name = req.body.name;
        image.description = req.body.description;
        image.photoName = req.file.originalname;
        image.photoPath = req.file.path;
        image.photoHash = path.parse(req.file.filename).name;
        image.photoUrl = '/public/uploads/' + req.file.filename;
    
        await image.save();
        res.redirect('/admin');
    } else{
        await fs.unlink(req.file.path);
        res.send('Error: Only .jpeg, .jpg, .gif, .png images');
    }
});
router.get('/admin/:id/delete',async(req,res)=>{
    const image = await Image.findByIdAndDelete(req.params.id);
    await fs.unlink(image.photoPath);

    res.redirect('/admin');
});
router.get('/catalogue/item/:id',async(req,res)=>{
    const image = await Image.findById(req.params.id);
    res.render('item',{ image });
});
router.get('/admin/edit/:id',async(req,res)=>{
    const image = await Image.findById(req.params.id);
    res.render('admin-edit',{ image });
});
router.post('/admin/edit/:id',async(req,res)=>{
    if(req.file === undefined){
        await Image.findByIdAndUpdate(req.params.id,{ $set: {
            name: req.body.name,
            description: req.body.description,
        } });
        res.redirect('/admin');   
    }else{
        if(/jpeg|jpg|gif|png/.test(req.file.mimetype)){
            const image = await Image.findById(req.params.id);
            await fs.unlink(image.photoPath);
    
            await Image.findByIdAndUpdate(req.params.id, { $set: {
                name: req.body.name,
                description: req.body.description,
                photoName: req.file.originalname,
                photoPath: req.file.path,
                photoHash: path.parse(req.file.filename).name,
                photoUrl: '/public/uploads/' + req.file.filename,
            } });
            res.redirect('/admin');

    }   else{
            await fs.unlink(req.file.path);
            res.send('Error: Only .jpeg, .jpg, .gif, .png images');
        }
    }
});

router.get('/admin/stock/:id',async (req,res)=>{
    const image = await Image.findById(req.params.id);
    const stock = !image.stock;
    await Image.findByIdAndUpdate(req.params.id,{ $set: {
        stock: stock
    } });
    res.redirect('/admin');
});

module.exports = router;
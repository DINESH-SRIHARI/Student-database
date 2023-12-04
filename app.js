import express from 'express'
import ejs, { name } from 'ejs'
import bodyParser from 'body-parser'
import mongoose, { mongo } from 'mongoose'
import session from 'express-session'
import mongodb from 'connect-mongodb-session'
import cors from 'cors'
const mongoSession=mongodb(session)

const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static('public'))
mongoose.connect('mongodb+srv://dinesh123:Asdfg@cluster0.elphlbx.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    console.log('mongose connected')
})
//add session to database
// const store=new mongodb({
//     uri:'mongodb+srv://dinesh123:Asdfg@cluster0.elphlbx.mongodb.net/?retryWrites=true&w=majority',
//     collection:session
// })
// app.use(session({
//     secret:'this is a top secret',
//     resave:false,
//     saveUninitialized:false,
//     store:store,
// }))

let User=mongoose.Schema(
    {
        name:{type:String,required:true},
        mail:{type:String,required:true}
    }
)
let Model=mongoose.model('teachers',User)
app.get('/',(req,res)=>{
    res.render('student')
})
app.get('/home',(req,res)=>{
    res.render('home')
})
app.post('/',async(req,res)=>{
    let data=await new Model({
        name:req.body.name,
        mail:req.body.mail
    }).save();
    res.redirect('/all')
})
app.get('/all',async(req,res)=>{
    let array=await Model.find()
    res.render('data',{all:array})
})
app.post('/edit', async (req, res) => {
    let data = await Model.findOne({ mail: req.body.mail });
    res.render('edit', { user: data });
});

app.post('/delete',async(req,res)=>{
    let data=await Model.deleteOne({mail:req.body.mail})
    res.redirect('/all')
})
app.post('/update',async(req,res)=>{
    let data=await Model.updateOne(
        {mail:req.body.oldmail},
        {
            $set:{
                name:req.body.name,
                mail:req.body.mail
            }
        }
    )
    res.redirect('/all')
})

app.listen(2000,()=>{
    console.log('started')
})
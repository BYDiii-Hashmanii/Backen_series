import express, { json } from 'express';
import morgan from "morgan";
import ejs from 'ejs'
import authRouter from './routes/auth.routes.js';

const app = express()

app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', authRouter);

app.get('/',(req , res)=>{
    res.send("server Is Running On Port 3000")
})

app.get('/welcome',(req , res)=>{
res.send("Well Come Dear Bydii")
})

export default app;

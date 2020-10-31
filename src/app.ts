import cors from 'cors';
import express from 'express';
import authRouter from './routers/authRouter';
import publicRouter from './routers/publicRouter';

const app = express();

// settings


// middlewares

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/public',publicRouter);
app.use('/auth',authRouter);


app.get('/', (req, res) => {
  return res.send(`The API is at http://localhost:${app.get('port')}`);
})



export default app;
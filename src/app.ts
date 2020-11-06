import cors from 'cors';
import express from 'express';
import authRouter from './routers/AuthRouter';
import publicRouter from './routers/PublicRouter';

const app = express();

// settings

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/public',publicRouter);
app.use('/auth',authRouter);

//MIDDLEWARES

export default app;
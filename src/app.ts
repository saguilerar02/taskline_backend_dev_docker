import cors from 'cors';
import express from 'express';
import authRouter from './routers/AuthRouter';
import publicRouter from './routers/PublicRouter';

const app = express();

// settings

app.use(cors({origin: 'http://localhost:4200'}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/public',publicRouter);
app.use('/auth',authRouter);

//MIDDLEWARES

export default app;
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import InitiateMongoServer from './config/db.js';
// import './models/UserModel.js';
// import './controllers/UserController.js';
import { router as routes } from './routes/index.js';

const PORT = 3000;

InitiateMongoServer();
// import './config/seed.js';
const app = express();

app.listen( PORT, console.log(`the movie api is running in http://localhots:${PORT}`));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);
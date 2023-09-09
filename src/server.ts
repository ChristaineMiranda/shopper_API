import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import route from './routes'


dotenv.config();
const server = express();
server.use(cors());
server.use(express.json());
server.use(route);

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`);
});
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connect from './src/db/connect.js';
import cookieParser from 'cookie-parser';
import fs from 'node:fs';

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();


//middlewares
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//routes
const routeFiles = fs.readdirSync('./src/routes');

routeFiles.forEach((file) => {
    // use dynamic import to import the route
    import(`./src/routes/${file}`)
    .then((route) => {
        app.use('/api/v1', route.default);
    })
    .catch((error) => {
        console.error('Failed to load route file: ', error.message);
    });

})


const server = async () => {
    try {
        await connect();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server..... ', error.message);
        process.exit(1);
    }
}

server();
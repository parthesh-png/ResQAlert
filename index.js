import express from 'express'
import dotenv from'dotenv'
import connectDB from './lib/db.js'
//import Redis from "ioredis"
import http from 'http'
import { initializeSocket } from './socket/socket.js'

import {
    createDisaster,
    deleteDisaster,
    getDisasterById,
    getDisasters,
    updateDisaster,
    getNearbyResources,
    getReports
} from './controllers/controller.js'
dotenv.config()




const app = express();


const port = process.env.PORT || 7000

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Disaster Response API is running"
    });
});



// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//     connectDB()
    
// });

const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectDB();
});


app.post('/disasters', createDisaster)
app.get('/disasters', getDisasters)
app.get('/disasters/:id', getDisasterById)
app.patch('/disasters/:id', updateDisaster)
app.delete('/disasters/:id', deleteDisaster)
app.get("/disasters/:id/resources", getNearbyResources)
app.get("/disasters/:id/reports", getReports);
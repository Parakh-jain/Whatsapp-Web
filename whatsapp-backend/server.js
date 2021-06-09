//importing
import express from 'express'
import mongoose from 'mongoose'
import Messages from "./dbMessages.js";
import Pusher from "pusher"
import cors from 'cors';


//app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1214680",
    key: "02f75b8643a9091101fe",
    secret: "10d88dcd46441d6606fe",
    cluster: "ap2",
    useTLS: true
});

//middleware
app.use(express.json())

app.use(cors());

//or

// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader("Access-Control-Allow-Headers","*");
//     next();
// });

//DB config
const connection_url = 'mongodb+srv://admin:7d5yQEWfAFLYf8P4@cluster0.h3oux.mongodb.net/whatsappdb?retryWrites=true&w=majority';

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});



//API routes    
const db = mongoose.connection

db.once('open', () => {
    console.log("Db connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();
    changeStream.on('change', (change) => {
        console.log(change);
        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            });
        }
        else {
            console.log("Error triggering pusher");
        }
    })
});


app.get("/", (req, res) => res.status(200).send('hello world'));

app.get('/messages/sync', (req, res) => {

    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(201).send(data)
        }
    })
})

//listen
app.listen(port, () => console.log(`listening on localhost: ${port}`));
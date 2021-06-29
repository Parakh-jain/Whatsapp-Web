//importing
import express from 'express'
import mongoose from 'mongoose'
import Messages from "./dbMessages.js";
import Rooms from './dbrooms.js'
import Pusher from "pusher"
import cors from 'cors';

//app config
const app = express();
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: process.env.PUSHER_appId,
    key: process.env.PUSHER_key,
    secret: process.env.PUSHER_secret,
    cluster: "ap2",
    useTLS: true
});

//middleware
app.use(express.json());

app.use(cors());    /*Cross-Origin Resource Sharing*/

// or

// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader("Access-Control-Allow-Headers","*");
//     next();
// });

//MongoDB config
const connection_url = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASS}@cluster0.tgwtr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// MongoDB ChangeStream
const db = mongoose.connection;

db.once('open', () => {
    console.log("Db connected");

    const messageCollection = db.collection("messages"); //messages same as in dbmessages
    const roomCollection = db.collection("rooms");  //rooms same as in dbrooms 

    const changeStream = messageCollection.watch();
    const changeStream2 = roomCollection.watch();

    /*Listening for changes in DB*/
    changeStream.on('change', (change) => {
        console.log("changed message");
        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted", // messages is my channel name
            {
                roomID: messageDetails.roomID,
                name: messageDetails.name,
                message: messageDetails.message,
                timeStamp: messageDetails.timeStamp,
                received: messageDetails.received
            });
        }
        else {
            console.log("Error triggering pusher");
        }
    })

    /*Listening for changes in DB*/
    changeStream2.on('change', (change) => {
        console.log("Changed room");

        if (change.operationType === 'insert') {
            const roomDetails = change.fullDocument;

            pusher.trigger('rooms', 'inserted',
                {
                    name: roomDetails.name,
                    image: roomDetails.image
                });
        }
        else {
            console.log("Error triggering Pusher");
        }
    })
});

//API routes    

// just to check whether it's working or not
app.get("/", (req, res) => res.status(200).send('hello world'));

//To get all the messages stored in the database
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

/*Get all ChatRooms*/
app.get('/rooms/sync', (req, res) => {

    Rooms.find((err, data) => {
        if (err) { res.status(500).send(err) }
        else { res.status(200).send(data) }
    })
})

//Get room by it's id
app.get('/rooms/:id', (req, res) => {
    Rooms.findById(req.params.id)
        .then(result => {
            res.status(200).json({
                name: result.name,
                image: result.image
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

/*Create a new message*/
app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(201).send(`new message created: \n ${data}`)
        }
    })
})

/*Create a new chatRoom*/
app.post('/rooms/new', (req, res) => {
    const dbRoom = req.body

    Rooms.create(dbRoom, (err, data) => {
        if (err) { res.status(500).send(err) }
        else { res.status(201).send(`new room created: \n ${data}`) }
    })
})

//listen
app.listen(port, () => console.log(`listening on localhost: ${port}`));
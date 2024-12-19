const express = require("express");
const app = express();
const PORT = process.env.PORT || 4001;
const amqp = require("amqplib");

app.use(express.json());
app.get("/send-msg", (req, res) => {
    
    // data to be sent
    const data = {
        title  : "Six of Crows",
        author : "Leigh Burdugo"
    }
    sendData(data);  // pass the data to the function we defined
    console.log("A message is sent to queue")
    res.send("Message Sent"); //response to the API request
    
})
app.listen(PORT, () => console.log("Server running at port " + PORT));

connectQueue();

var channel, connection;  
async function connectQueue() {   
    try {
        connection = await amqp.connect("amqp://user:user@localhost:5672");
        channel    = await connection.createChannel()
        await channel.assertQueue("test-queue")
        console.log(`Connected to RabbitMQ and queue 'test-queue' initialized.`);
        channel.consume("test-queue", data => {
            console.log(`${Buffer.from(data.content)}`);
            channel.ack(data);
        })
    } catch (error) {
        console.log(error)
    }
}

async function sendData (data) {
    // send data to queue
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
}
const express = require("express");
const app = express();
const amqp = require('amqplib');

// Define the RabbitMQ connection URL
const amqpUrl = "amqp://localhost:5672";

// Sample order data to be sent to the queue
const orderdata = {
    id: 2,
    name: 'kwame',
    item: 'phone',
};

// Define a route for the root URL
app.get('/', async (req, res) => {
    try {
        // Create a connection to the RabbitMQ server
        const connection = await amqp.connect(amqpUrl);

        // Create a channel on this connection
        const channel = await connection.createChannel();

        // Make sure the 'order.shipped' queue exists, create it if not
        await channel.assertQueue("order.shipped");

        // Send the order data to the 'order.shipped' queue
        channel.sendToQueue("order.shipped", Buffer.from(JSON.stringify(orderdata)));

        // Log success in the console
        console.log("Order data sent to queue");
    } catch (error) {
        // Log any errors that occur during the process
        console.log(error);
    }

    // Send a response back to the client indicating the request was received
    res.send("ORDERS API");
});

// Start the server and listen on port 8000
app.listen(8000, () => {
    console.log("ORDERS API listening on port 8000");
});
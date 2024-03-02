const express = require("express");
const amqp = require('amqplib');

// Define the RabbitMQ server URL
const amqpUrl = "amqp://localhost:5672";

// Initialize an Express application
const app = express();

// Define a route for the root URL to act as a consumer
app.get("/", async (req, res) => {
  try {
    // Establish a connection to the RabbitMQ server
    const connection = await amqp.connect(amqpUrl);

    // Create a channel on the established connection
    const channel = await connection.createChannel();

    // Ensure the 'order.shipped' queue exists before attempting to consume messages from it
    await channel.assertQueue("order.shipped");

    // Start consuming messages from the 'order.shipped' queue
    channel.consume("order.shipped", (msg) => {
      console.log("Received a message from 'order.shipped' queue.");

      // Acknowledge that the message has been processed successfully
      channel.ack(msg);

      // Respond to the HTTP request with the message content in JSON format
      res.json({ msg: JSON.parse(msg.content.toString()) });
    });
  } catch (error) {
    // Log any errors that occur during connection or consumption
    console.log(error);
  }
});

// Start the server and listen on port 8001 for incoming connections
app.listen(8001, () => {
  console.log("Listening on PORT 8001");
});
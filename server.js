// server.js

const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the express app
const app = express();

// Enable CORS to allow frontend requests
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Razorpay credentials (Replace with your actual credentials)
const razorpay = new Razorpay({
  key_id: 'rzp_test_H30R2MC6bNQ3Lj',  // Your Razorpay key id
  key_secret: 'gGQ3qI4j89cQu0IGR4VTaZFS'      // Your Razorpay secret key
});

// Route to create Razorpay order
app.post('/create_order', (req, res) => {
  const { amount, currency } = req.body;

  const options = {
    amount: amount,  // amount in paise (e.g., 50000 = 500 INR)
    currency: currency,
    receipt: 'receipt#1',
  };

  razorpay.orders.create(options, (err, order) => {
    if (err) {
      return res.status(500).send({ error: err });
    }
    res.send(order);  // Send the created order ID to frontend
  });
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

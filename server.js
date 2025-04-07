// server.js

const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

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
    amount: amount,  // amount in paise (e.g., 100 = 1 INR)
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

// Route to verify payment signature
app.post('/verify_payment', (req, res) => {
  const { payment_id, order_id, signature } = req.body;

  const hmac = crypto.createHmac('sha256', 'gGQ3qI4j89cQu0IGR4VTaZFS');
  hmac.update(order_id + '|' + payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === signature) {
    // Payment is valid
    res.send({ success: true });
  } else {
    // Payment failed
    res.send({ success: false });
  }
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

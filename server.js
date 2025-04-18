
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      })),
      mode: 'payment',
      success_url: `http://0.0.0.0:5000/success`,
      cancel_url: `http://0.0.0.0:5000/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Checkout endpoint
app.post('/checkout', async (req, res) => {
  try {
    const { items, shippingInfo, paymentInfo } = req.body;
    
    // Here you would integrate with your payment processor
    // For demo purposes, we'll just send success
    
    res.json({
      success: true,
      message: 'Order processed successfully',
      orderId: Math.random().toString(36).substring(7)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing order'
    });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});

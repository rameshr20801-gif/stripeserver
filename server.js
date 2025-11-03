const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")("process.env.STRIPE_SECRET_KEY");

app.use(cors());
app.use(bodyParser.json());

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: req.body.items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    success_url: "https://your-frontend-site/success",
    cancel_url: "https://your-frontend-site/cancel",
  });

  res.json({ url: session.url });
});

app.listen(4242, () => console.log("Server running on port 4242"));
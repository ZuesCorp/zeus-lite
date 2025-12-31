const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sig = event.headers["stripe-signature"];

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    console.log("Checkout completed:", session.id);
  }

  if (stripeEvent.type === "customer.subscription.created") {
    const subscription = stripeEvent.data.object;
    console.log("Subscription created:", subscription.id);
  }

  return {
    statusCode: 200,
    body: "Received",
  };
};

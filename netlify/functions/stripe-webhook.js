import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
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
    body: JSON.stringify({ received: true }),
  };
}

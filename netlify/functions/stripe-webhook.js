const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const sig =
    event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64")
    : Buffer.from(event.body, "utf8");

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  console.log("✅ Stripe event:", stripeEvent.type);

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    console.log("✅ Checkout completed:", session.id, session.customer_email);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};

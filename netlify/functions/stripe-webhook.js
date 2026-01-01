const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return { statusCode: 500, body: "Missing STRIPE_WEBHOOK_SECRET" };
  }

  const sig =
    event.headers["stripe-signature"] ||
    event.headers["Stripe-Signature"] ||
    event.headers["STRIPE-SIGNATURE"];

  if (!sig) {
    return { statusCode: 400, body: "Missing Stripe signature header" };
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : (event.body || "");

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  try {
    switch (stripeEvent.type) {
      case "checkout.session.completed": {
        const session = stripeEvent.data.object;


        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = stripeEvent.data.object;

        
        break;
      }

      case "customer.subscription.updated": {
        const sub = stripeEvent.data.object;

    
        break;
      }

      case "customer.subscription.deleted": {
        const sub = stripeEvent.data.object;

        break;
      }

      default:
        
        break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
   
    return {
      statusCode: 500,
      body: `Server Error: ${err.message}`,
    };
  }
};

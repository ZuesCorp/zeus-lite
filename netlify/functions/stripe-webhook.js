// netlify/functions/stripe-webhook.js
//
// Stripe -> Netlify Function -> Supabase
// This is the ONLY place that should ever mark someone "active" or "inactive".
// Frontend never decides.
//
// Env vars required:
// - STRIPE_SECRET_KEY
// - STRIPE_WEBHOOK_SECRET
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY

const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function getRawBody(event) {
  if (!event || typeof event.body !== "string") return "";
  if (event.isBase64Encoded) {
    return Buffer.from(event.body, "base64").toString("utf8");
  }
  return event.body;
}

async function extractIdentityFromStripeObject(obj) {
  let email =
    obj?.customer_details?.email ||
    obj?.customer_email ||
    obj?.billing_details?.email ||
    null;

  const stripeCustomerId =
    typeof obj?.customer === "string" ? obj.customer : obj?.customer?.id || null;

  if (!email && stripeCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(stripeCustomerId);
      email = customer?.email || null;
    } catch (e) {}
  }

  return { email, stripeCustomerId };
}

async function upsertSubscriber({ email, stripeCustomerId, status }) {
  if (!email) {
    console.warn("[stripe-webhook] Missing email; cannot upsert subscriber.");
    return;
  }

  const payload = {
    email: String(email).toLowerCase().trim(),
    stripe_customer_id: stripeCustomerId || null,
    subscription_status: status,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("zeus_subscribers")
    .upsert(payload, { onConflict: "email" });

  if (error) {
    console.error("[stripe-webhook] Supabase upsert error:", error);
    throw error;
  }
}

exports.handler = async (event) => {
  const sig =
    event.headers["stripe-signature"] || event.headers["Stripe-Signature"];
  const rawBody = getRawBody(event);

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err.message);
    return { statusCode: 400, body: "Webhook signature verification failed" };
  }

  try {
    const type = stripeEvent.type;
    const obj = stripeEvent.data?.object;

    if (type === "checkout.session.completed") {
      const { email, stripeCustomerId } = await extractIdentityFromStripeObject(
        obj
      );
      await upsertSubscriber({ email, stripeCustomerId, status: "active" });
    }

    if (type === "invoice.paid") {
      const { email, stripeCustomerId } = await extractIdentityFromStripeObject(
        obj
      );
      await upsertSubscriber({ email, stripeCustomerId, status: "active" });
    }

    if (type === "invoice.payment_failed") {
      const { email, stripeCustomerId } = await extractIdentityFromStripeObject(
        obj
      );
      await upsertSubscriber({ email, stripeCustomerId, status: "past_due" });
    }

    if (type === "customer.subscription.deleted") {
      const { email, stripeCustomerId } = await extractIdentityFromStripeObject(
        obj
      );
      await upsertSubscriber({ email, stripeCustomerId, status: "inactive" });
    }

    if (type === "customer.subscription.updated") {
      const { email, stripeCustomerId } = await extractIdentityFromStripeObject(
        obj
      );

      const stripeStatus = obj?.status || "inactive";
      const mapped =
        stripeStatus === "active"
          ? "active"
          : stripeStatus === "past_due"
          ? "past_due"
          : "inactive";

      await upsertSubscriber({ email, stripeCustomerId, status: mapped });
    }

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("[stripe-webhook] Handler error:", err);
    return { statusCode: 500, body: "Webhook handler failed" };
  }
};

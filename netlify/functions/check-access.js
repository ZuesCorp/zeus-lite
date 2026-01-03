import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  const { email } = JSON.parse(event.body || "{}");

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ allowed: false }) };
  }

  const { data } = await supabase
    .from("zeus_subscribers")
    .select("subscription_status")
    .eq("email", email)
    .single();

  const allowed = data?.subscription_status === "active";

  return {
    statusCode: 200,
    body: JSON.stringify({ allowed })
  };
};

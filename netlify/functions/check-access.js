const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function json(statusCode, obj) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: JSON.stringify(obj),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { allowed: false, status: "unknown" });
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return json(400, { allowed: false, status: "unknown" });
  }

  const email = String(payload.email || "").toLowerCase().trim();
  if (!email || !email.includes("@")) {
    return json(400, { allowed: false, status: "unknown" });
  }

  try {
    const { data, error } = await supabase
      .from("zeus_subscribers")
      .select("status")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("[check-access] Supabase error:", error);
      return json(500, { allowed: false, status: "unknown" });
    }

    const status = data?.status || "unknown";
    const allowed = status === "active";

    return json(200, { allowed, status });
  } catch (err) {
    console.error("[check-access] Handler error:", err);
    return json(500, { allowed: false, status: "unknown" });
  }
};

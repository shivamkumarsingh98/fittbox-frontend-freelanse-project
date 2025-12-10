import axios from "axios";

const api = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req) {
  try {
    const body = await req.json();
    const meals = Array.isArray(body.meals) ? body.meals : [];

    const authHeader = req.headers.get("authorization") || null;
    const token = authHeader ? authHeader.replace(/^Bearer\s+/i, "") : null;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Deduplicate meals to avoid duplicate inserts
    const seen = new Set();
    const uniqueMeals = [];
    for (const m of meals) {
      const keyObj = {
        category: m.category,
        type: m.type,
        name: m.name,
        mealOption: m.mealOption ?? null,
        price: Number(m.price ?? m.veg ?? m.nonveg ?? 0),
      };
      const key = JSON.stringify(keyObj);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMeals.push(m);
      }
    }

    const results = [];
    // Forward sequentially and strip `img`
    for (const m of uniqueMeals) {
      const forwardPayload = { ...m };
      if (forwardPayload.hasOwnProperty("img")) delete forwardPayload.img;
      if (forwardPayload.price === undefined) {
        forwardPayload.price = Number(
          forwardPayload.veg ?? forwardPayload.nonveg ?? 0
        );
      } else {
        forwardPayload.price = Number(forwardPayload.price);
      }
      const resp = await axios.post(
        `${api}/api/createtrialmeal`,
        forwardPayload,
        { headers }
      );
      results.push(resp.data);
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
    });
  } catch (err) {
    console.error("[batchTrialMeals] error:", err?.response || err);
    const message =
      err?.response?.data?.message || err.message || "Batch create failed";
    return new Response(JSON.stringify({ success: false, message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

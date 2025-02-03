import { env } from "../../../lib/env";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "General";

  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${category}&lang=en&country=us&max=10&apikey=${env.NEWS_URL}`,
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching news articles" }),
      { status: 500 },
    );
  }
}

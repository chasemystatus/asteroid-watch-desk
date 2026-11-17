export default async function handler(request) {
  const date = new URL(request.url).searchParams.get("date");
  const apiKey = process.env.NASA_API_KEY;

  if (!date) {
    return Response.json({ error: "Please select a date." }, { status: 400 });
  }

  if (!apiKey) {
    return Response.json(
      { error: "The service is not configured." },
      { status: 500 },
    );
  }

  const apiUrl = new URL("https://api.nasa.gov/neo/rest/v1/feed");
  apiUrl.searchParams.set("start_date", date);
  apiUrl.searchParams.set("end_date", date);
  apiUrl.searchParams.set("api_key", apiKey);

  const nasaResponse = await fetch(apiUrl);

  if (!nasaResponse.ok) {
    return Response.json(
      { error: "Service unavailable. Please try again." },
      { status: 502 },
    );
  }

  const asteroidData = await nasaResponse.json();

  const dailyAsteroidCount = {
    date,
    count: asteroidData.element_count,
  };

  return Response.json(dailyAsteroidCount);
}

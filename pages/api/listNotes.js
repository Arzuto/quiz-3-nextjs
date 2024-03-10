export default async function handler(req, res) {
  try {
    const response = await fetch("https://paace-f178cafcae7b.nevacloud.io/api/notes");

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);

    res.status(500).json({ error: "Internal Server Error" });
  }
}
export default async function handler(req, res) {
  try {
    const { title, description } = req.body; 

    const response = await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }), 
    });

    if (!response.ok) {
      throw new Error(`Failed to add note: ${response.statusText}`);
    }

    const responseData = await response.json(); 

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
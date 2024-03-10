export default async function handler(req, res) {
  try {
    const { id } = req.query; 
    const { title, description } = req.body;

    const response = await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/notes/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }), 
    });

    if (!response.ok) {
      throw new Error(`Failed to update note: ${response.statusText}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

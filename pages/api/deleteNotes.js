export default async function handler(req, res) {
  try {
    const { id } = req.query; 
    
    const response = await fetch(`https://paace-f178cafcae7b.nevacloud.io/api/notes/delete/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to delete note: ${response.statusText}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);

    res.status(500).json({ error: "Internal Server Error" });
  }
}

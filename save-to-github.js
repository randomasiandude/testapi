export default async (req, res) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const { data } = req.body;

  try {
    // 1. Get existing file data
    const getResponse = await fetch(
      'https://api.github.com/repos/randomasiandude/testapi/contents/data.json',
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );
    
    const existingData = await getResponse.json();
    const sha = existingData.sha;
    
    // 2. Decode and update content
    const currentContent = JSON.parse(
      Buffer.from(existingData.content, 'base64').toString()
    );
    
    const newContent = Array.isArray(currentContent) 
      ? [...currentContent, data] 
      : [data];

    // 3. Update file
    const updateResponse = await fetch(
      'https://api.github.com/repos/randomasiandude/testapi/contents/data.json',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add login data - ${new Date().toISOString()}`,
          content: Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64'),
          sha: sha
        })
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update GitHub' });
  }
};
export default async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const { data } = req.body;

    // Get existing file
    const getRes = await fetch(
      'https://api.github.com/repos/randomasiandude/testapi/contents/data.json',
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );
    
    if (!getRes.ok) throw new Error('Failed to fetch file');
    
    const existing = await getRes.json();
    const currentContent = JSON.parse(Buffer.from(existing.content, 'base64').toString());
    
    // Update content
    const newContent = Array.isArray(currentContent) 
      ? [...currentContent, data] 
      : [data];

    // Push update
    const updateRes = await fetch(
      'https://api.github.com/repos/randomasiandude/testapi/contents/data.json',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `New login @ ${new Date().toISOString()}`,
          content: Buffer.from(JSON.stringify(newContent)).toString('base64'),
          sha: existing.sha
        })
      }
    );

    if (!updateRes.ok) throw new Error('GitHub update failed');
    
    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Server error' 
    });
  }
};
export default async (req, res) => {
  const { data } = req.body;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  // Step 1: Get the SHA of the existing file
  const getShaResponse = await fetch(
    "https://api.github.com/repos/randomasiandude/testapi/contents/data.json",
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    }
  );
  const existingFileData = await getShaResponse.json();
  const sha = existingFileData.sha;

  // Step 2: Update the file
  const updateResponse = await fetch(
    "https://api.github.com/repos/randomasiandude/testapi/contents/data.json",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update data.json",
        content: Buffer.from(JSON.stringify(data)).toString("base64"),
        sha: sha, // Use the fetched SHA
      }),
    }
  );

  res.status(200).json({ success: true });
};
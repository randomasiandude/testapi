export default async (req, res) => {
  const { data } = req.body;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  const response = await fetch(
    "https://api.github.com/repos/your-username/your-repo/contents/data.json",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update data.json",
        content: Buffer.from(JSON.stringify(data)).toString("base64"),
        sha: "existing-file-sha", // Optional: Get this via GitHub API first
      }),
    }
  );

  res.status(200).json({ success: true });
};


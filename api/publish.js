const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: "1a9bdce7a7af99367d6d",
  secret: process.env.PUSHER_APP_SECRET,
  cluster: "us2",
  useTLS: true,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { channel, event, data } = req.body;

  try {
    await pusher.trigger(channel, event, data);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Pusher error:", error);
    return res.status(500).json({ error: "Failed to publish event" });
  }
}

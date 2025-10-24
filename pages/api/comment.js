export default function handler(req, res) {
  const { post } = req.query;

  // Fake data for now
  const demoComments = {
    "https://jejakiman.pages.dev/post1": [
      { author: "Ali", text: "MashaAllah, good post!" },
      { author: "Aina", text: "Very inspiring, jazakallah khair." }
    ],
  };

  const comments = demoComments[post] || [];
  res.status(200).json(comments);
}

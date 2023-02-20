import { db } from "../../server/firebase";

export default async function handler(req, res) {
  const gamesRef = db.collection("games");
  const response = await gamesRef.add(JSON.parse(req.body));

  res.status(200).json({ status: "DONE", uid: response.id });
}

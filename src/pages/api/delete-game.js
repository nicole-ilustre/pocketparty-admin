import { db } from "../../server/firebase";

export default async function handler(req, res) {
  const gamesRef = db.collection("games");
  await gamesRef.doc(req.query.uid).delete();

  res.status(200).json({ status: "ok" });
}

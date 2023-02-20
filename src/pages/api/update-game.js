import { db } from "../../server/firebase";

export default async function handler(req, res) {
  const data = JSON.parse(req.body);
  const { uid, ...gameData } = data;
  const gamesRef = db.collection("games");
  await gamesRef.doc(uid).set({
    ...gameData,
  });

  res.status(200).json({ status: "DONE" });
}

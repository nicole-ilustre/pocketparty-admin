import { db } from "../../server/firebase";

export default async function handler(req, res) {
  const data = JSON.parse(req.body);
  const { uid, merge = false, ...gameData } = data;
  const gamesRef = db.collection("games");
  await gamesRef.doc(uid).set(
    {
      ...gameData,
    },
    merge ? { merge: true } : undefined
  );

  res.status(200).json({ status: "DONE" });
}

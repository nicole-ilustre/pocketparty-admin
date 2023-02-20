import { db } from "../../server/firebase";

export default async function handler(req, res) {
  const gamesRef = db.collection("games");
  const queryRef = gamesRef.where("slug", "==", req.query.slug);
  const snapshot = await queryRef.get();
  const data = [];
  snapshot.forEach(async (doc) => {
    data.push({
      uid: doc.id,
      ...doc.data(),
    });
  });

  if (data.length === 0) {
    res.status(404).json({ status: "failed" });
    return;
  }

  res.status(200).json({ status: "ok", data: data[0] });
}

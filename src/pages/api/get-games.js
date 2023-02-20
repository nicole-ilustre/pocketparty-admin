import { db } from "../../server/firebase";

export default async function handler(req, res) {
  const gamesRef = db.collection("games");
  const snapshot = await gamesRef.get();
  const data = [];
  snapshot.forEach(async (doc) => {
    data.push({
      uid: doc.id,
      ...doc.data(),
    });
  });
  res.status(200).json(data);
}

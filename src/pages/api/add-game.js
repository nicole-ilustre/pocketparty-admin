import { db } from "../../server/firebase";

export default async function handler(req, res) {
  const gamesRef = db.collection("games");
  const response = await gamesRef.add(JSON.parse(req.body));

  const gameBookmarkRef = db.collection("game-bookmarks");

  await gameBookmarkRef.doc(response.id).set({
    count: 0,
    weight: 0,
  });

  res.status(200).json({ status: "DONE", uid: response.id });
}

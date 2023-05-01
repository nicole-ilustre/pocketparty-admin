import { db } from "../../server/firebase";

export const getGamesSnapshot = async () => {
  const gamesRef = db.collection("games");
  return await gamesRef.get();
};

export const getCurratedGamesSnapshot = async () => {
  const gamesRef = db
    .collection("games")
    .where("isPublic", "==", true)
    .where("isCurrated", "==", true);
  return await gamesRef.get();
};

export default async function handler(req, res) {
  const snapshot = await getGamesSnapshot();
  const data = [];
  snapshot.forEach(async (doc) => {
    data.push({
      uid: doc.id,
      ...doc.data(),
    });
  });

  res.status(200).json(data);
}

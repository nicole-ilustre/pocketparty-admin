import { db } from "../../server/firebase";

export const getConfigDoc = async (configKey) => {
  const configRef = db.collection("site-config");
  return await configRef.doc(configKey).get();
};

export default async function handler(req, res) {
  const doc = await getConfigDoc(req.query.config);

  if (!doc.exists) {
    res.status(404).json({ status: "failed" });
    return;
  }

  res.status(200).json({
    status: "ok",
    data: {
      id: doc.id,
      ...doc.data(),
    },
  });
}

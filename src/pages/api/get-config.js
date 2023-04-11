import { db } from "../../server/firebase";

export default async function handler(req, res) {
  const configRef = db.collection("site-config");
  const doc = await configRef.doc(req.query.config).get();

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

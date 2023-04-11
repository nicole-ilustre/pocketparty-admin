import { db } from "../../server/firebase";

export default async function handler(req, res) {
  const data = JSON.parse(req.body);
  const { uid, config } = data;
  const configRef = db.collection("site-config");
  await configRef.doc(uid).set({
    ...config,
  });

  res.status(200).json({ status: "DONE" });
}

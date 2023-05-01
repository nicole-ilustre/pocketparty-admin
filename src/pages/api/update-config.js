import { db } from "../../server/firebase";

export const updateConfig = async (uid, config) => {
  const configRef = db.collection("site-config");
  await configRef.doc(uid).set({
    ...config,
  });
};

export default async function handler(req, res) {
  const data = JSON.parse(req.body);
  const { uid, config } = data;
  await updateConfig(uid, config);

  res.status(200).json({ status: "DONE" });
}

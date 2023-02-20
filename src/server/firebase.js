import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "../../service-account.json";
try {
  initializeApp({
    credential: cert(serviceAccount),
  });
} catch (e) {
  console.log(e);
}

export const db = getFirestore();

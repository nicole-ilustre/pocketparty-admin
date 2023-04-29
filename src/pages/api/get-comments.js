import { db } from "../../server/firebase";

export default async function handler(req, res) {
  const commentsRef = db.collection("comments");

  let query = commentsRef.orderBy("createdAt", "desc");

  if (req.query.nextToken) {
    const afterDoc = await commentsRef.doc(req.query.nextToken).get();
    query = commentsRef.orderBy("createdAt", "desc").startAfter(afterDoc);
  }

  let isPrev = false;
  if (req.query.prevToken) {
    const prevDoc = await commentsRef.doc(req.query.prevToken).get();
    query = commentsRef.orderBy("createdAt", "asc").startAfter(prevDoc);
    isPrev = true;
  }

  const snapshot = await query.limit(50).get();
  const data = [];

  snapshot.forEach((doc) => {
    const commentData = doc.data();
    data.push({
      uid: doc.id,
      ...commentData,
      createdAt: commentData.createdAt.toDate().getTime(),
      updatedAt: commentData.updatedAt.toDate().getTime(),
    });
  });

  res.status(200).json({ data: isPrev ? data.reverse() : data });
}

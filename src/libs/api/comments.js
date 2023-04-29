export const getComments = async ({ startAfterUid, endBeforeUid } = {}) => {
  const searchParams = new URLSearchParams();

  if (startAfterUid !== undefined) {
    searchParams.append("nextToken", startAfterUid);
  }

  if (endBeforeUid !== undefined) {
    searchParams.append("prevToken", endBeforeUid);
  }

  const response = await fetch(`/api/get-comments?${searchParams.toString()}`);

  if (!response.ok) {
    return undefined;
  }

  const { data } = await response.json();
  return { data };
};

export const updateConfig = async (uid, config) => {
  const response = await fetch(`/api/update-config`, {
    method: "POST",
    body: JSON.stringify({ uid, config }),
  });

  if (!response.ok) {
    return undefined;
  }

  return await response.json();
};

export const getConfig = async (config) => {
  const searchParams = new URLSearchParams();

  searchParams.append("config", config);

  const response = await fetch(`/api/get-config?${searchParams.toString()}`);

  if (!response.ok) {
    return undefined;
  }

  const { data } = await response.json();
  return data;
};

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

export const getGameBySlug = async (slug) => {
  const searchParams = new URLSearchParams();
  searchParams.append("slug", slug);

  const response = await fetch(
    `/api/get-game-by-slug?${searchParams.toString()}`
  );

  if (!response.ok) {
    return undefined;
  }

  const { data } = await response.json();
  return data;
};

export const updateGame = async (data) => {
  const response = await fetch(`/api/update-game`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return undefined;
  }

  return await response.json();
};

export const addGame = async (data) => {
  const response = await fetch(`/api/add-game`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return undefined;
  }

  return await response.json();
};

export const deleteGame = async (uid) => {
  const searchParams = new URLSearchParams();
  searchParams.append("uid", uid);
  const response = await fetch(`/api/delete-game?${searchParams.toString()}`);

  if (!response.ok) {
    return undefined;
  }

  return await response.json();
};

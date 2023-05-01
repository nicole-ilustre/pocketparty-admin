export const updateBundle = async () => {
  const response = await fetch(`/api/update-bundle`);

  if (!response.ok) {
    return undefined;
  }

  return await response.json();
};

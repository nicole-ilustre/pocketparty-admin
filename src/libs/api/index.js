import { updateConfig } from "./config";
import { updateBundle } from "./bundle";

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

export const getGames = async () => {
  const response = await fetch("/api/get-games");

  if (!response.ok) {
    return [];
  }

  return await response.json();
};

export const updateGame = async (data) => {
  const response = await fetch(`/api/update-game`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return undefined;
  }

  updateDisplayFilters();
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

  updateDisplayFilters();
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

export const updateDisplayFilters = async () => {
  const games = await getGames();

  let filters = new Set();
  let players = { min: null, max: null };
  games
    .filter((game) => game.isPublic)
    .forEach((game) => {
      game.filters.forEach((filter) => {
        filters.add(filter);
      });

      if (players.min === null) {
        players.min = game.playersMin;
      } else {
        players.min = Math.min(players.min, game.playersMin);
      }

      if (players.max === null) {
        players.max = game.playersMax;
      } else {
        players.max = Math.max(players.max, game.playersMax || game.playersMin);
      }
    });

  await updateConfig("display-filters", {
    filters: Array.from(filters),
    players,
  });
};

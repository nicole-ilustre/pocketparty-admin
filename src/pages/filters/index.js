import { useEffect, useState } from "react";
import Head from "next/head";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import FilterUI from "@/components/filters";

import { updateConfig } from "@/libs/api/config";

const getSortedFilters = (games, filtersOrder) => {
  const filtersSet = new Set();

  games
    .filter((game) => game.isPublic)
    .forEach((game) => {
      game.filters.map((filter) => filtersSet.add(filter.trim().toLowerCase()));
    });

  const filters = Array.from(filtersSet).sort();

  const existingFilters = filtersOrder.filter((filterName) =>
    filters.includes(filterName)
  );
  const newFilters = filters.filter(
    (filterName) => existingFilters.includes(filterName) === false
  );

  return [...existingFilters, ...newFilters];
};

function Filters() {
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const gamesPromise = fetch("/api/get-games").then((response) =>
      response.json()
    );

    const filtersPromise = fetch("/api/get-config?config=filters-order").then(
      (response) => response.json()
    );

    Promise.all([gamesPromise, filtersPromise]).then(([games, filters]) => {
      setData(getSortedFilters(games, filters.data.filters));
      setShowData(true);
    });
  }, []);

  const onSave = async (filters) => {
    setShowData(false);
    await updateConfig("filters-order", { filters });
    setData([...filters]);
    setShowData(true);
  };

  return (
    <>
      <Head>
        <title>Pocket Party - Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {showData ? (
        <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>
          <Typography variant="h4" sx={{ marginBottom: "4px" }}>
            Pocket Party - Filters
          </Typography>
          <Typography variant="caption" sx={{ marginBottom: "16px" }}>
            New Filters would be at the bottom of the list alphabetically
            sorted.
          </Typography>
          <FilterUI filters={data} onSave={onSave} />
        </Container>
      ) : (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
}

export default Filters;

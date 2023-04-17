import { useEffect, useState } from "react";
import Head from "next/head";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import CurratedGames from "@/components/currated-games";

import { getConfig, updateConfig } from "@/libs/api/config";
import { getGames, updateGame } from "@/libs/api";

function Curation() {
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const curratedGamesPromise = getConfig("currated-games");
    const gamesPromise = getGames();

    Promise.all([gamesPromise, curratedGamesPromise]).then(
      ([games, { games: currationList }]) => {
        setData(currationList);
        setGames(games);
        setShowData(true);
      }
    );
  }, []);

  const onSave = async (currationList) => {
    setShowData(false);

    const gamesRemovedFromCurrations = data.filter(
      (gameUID) => currationList.includes(gameUID) === false
    );
    const newGameAddedToCurration = currationList.filter(
      (gameUID) => data.includes(gameUID) === false
    );

    await updateConfig("currated-games", { games: currationList });

    const removedPromises = gamesRemovedFromCurrations.map((uid) =>
      updateGame({ uid, merge: true, isCurrated: false })
    );
    const addedPromises = newGameAddedToCurration.map((uid) =>
      updateGame({ uid, merge: true, isCurrated: true })
    );

    await Promise.all([...removedPromises, ...addedPromises]);

    setData(currationList);
    setShowData(true);
  };

  return (
    <>
      <Head>
        <title>Pocket Party - Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {showData ? (
          <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>
            <Typography variant="h4" sx={{ marginBottom: "4px" }}>
              Pocket Party - Currated Games
            </Typography>
            <CurratedGames
              curratedGames={data}
              gamesList={games}
              onSave={onSave}
            />
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
      </main>
    </>
  );
}

export default Curation;

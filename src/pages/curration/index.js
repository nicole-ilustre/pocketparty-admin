import { useEffect, useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import CurratedGames from "@/components/currated-games";

import Loader from "@/ui-components/loader";

import { getConfig, updateConfig } from "@/libs/api/config";
import { getGames, updateGame } from "@/libs/api";
import { updateBundle } from "@/libs/api/bundle";

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
    updateBundle();

    setData(currationList);
    setShowData(true);
  };

  if (showData === false) {
    return <Loader />;
  }

  return (
    <main>
      <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>
        <Typography variant="h4" sx={{ marginBottom: "4px" }}>
          Pocket Party - Currated Games
        </Typography>
        <CurratedGames curratedGames={data} gamesList={games} onSave={onSave} />
      </Container>
    </main>
  );
}

export default Curation;

import { useEffect, useState } from "react";
import Head from "next/head";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import GameDataUI from "@/components/game-data";

import { getConfig } from "@/libs/api/config";

function GameData() {
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const gamesDataPromise = getConfig("games-data-list");

    Promise.all([gamesDataPromise]).then(([gamesDataList]) => {
      setData(gamesDataList);
      setShowData(true);
    });
  }, []);

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
            Pocket Party - Game Data
          </Typography>
          <GameDataUI gameData={data} onSave={() => {}} />
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

export default GameData;

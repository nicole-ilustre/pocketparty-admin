import { useCallback, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import AddGame from "./add-game";
import Game from "./game";

function CurratedGames({ curratedGames, gamesList, onSave }) {
  const [renderedCurratedGames, setRenderedCurratedGames] =
    useState(curratedGames);

  const addedGames = useMemo(() => {
    const gameHash = {};

    gamesList.forEach((game) => {
      gameHash[game.uid] = game;
    });

    return renderedCurratedGames.map((uid) => gameHash[uid]).filter(Boolean);
  }, [renderedCurratedGames, gamesList]);

  const onMove = useCallback(
    (idx, movement) => {
      let targetIdx;
      if (movement === "up") {
        targetIdx = idx - 1;
      } else {
        targetIdx = idx + 1;
      }

      if (targetIdx < 0 || targetIdx >= renderedCurratedGames.length) {
        return;
      }

      const newRenderedCurratedGames = [...renderedCurratedGames];

      newRenderedCurratedGames[targetIdx] = renderedCurratedGames[idx];
      newRenderedCurratedGames[idx] = renderedCurratedGames[targetIdx];

      setRenderedCurratedGames(newRenderedCurratedGames);
    },
    [renderedCurratedGames]
  );

  const onDelete = (idx) => {
    const newRenderedCurratedGames = [
      ...renderedCurratedGames.slice(0, idx),
      ...renderedCurratedGames.slice(idx + 1),
    ];

    setRenderedCurratedGames(newRenderedCurratedGames);
  };

  const onSubmit = () => {
    onSave(renderedCurratedGames);
  };

  return (
    <>
      {renderedCurratedGames.length === 0 ? (
        <Typography variant="caption" sx={{ marginBottom: "16px" }}>
          No games added to currated list
        </Typography>
      ) : null}
      <Box sx={{ flexGrow: 1, maxWidth: 560 }}>
        {addedGames.map((game, idx) => (
          <Game
            key={game.uid}
            text={game.title}
            onMove={(movement) => onMove(idx, movement)}
            onDelete={() => onDelete(idx)}
          />
        ))}
        <List>
          <AddGame
            curratedGames={renderedCurratedGames}
            gamesList={gamesList}
            onAddGame={(game) => {
              setRenderedCurratedGames((existingGames) => [
                ...existingGames,
                game.uid,
              ]);
            }}
          />
        </List>

        <Box
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            sx={{ marginLeft: "8px" }}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CurratedGames;

import { useMemo, useState } from "react";

import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import AddCircle from "@mui/icons-material/AddCircle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

function AddGame({ curratedGames, gamesList, onAddGame }) {
  const [selectedGame, setSelectedGame] = useState("");
  const onAddClick = () => {
    onAddGame(selectedGame);
    setSelectedGame("");
  };

  const notCurratedGames = useMemo(() => {
    return gamesList
      .filter((game) => curratedGames.includes(game.uid) === false)
      .sort(function (a, b) {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
  }, [curratedGames, gamesList]);

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="Up"
          style={{ marginRight: "4px" }}
          onClick={onAddClick}
        >
          <AddCircle />
        </IconButton>
      }
    >
      <FormControl fullWidth>
        <InputLabel id="game-select-label">Game</InputLabel>
        <Select
          value={selectedGame}
          labelId="game-select-label"
          label="Game"
          onChange={(e) => setSelectedGame(e.target.value)}
          style={{ marginRight: "12px" }}
        >
          {notCurratedGames.map((game) => (
            <MenuItem key={game.uid} value={game}>
              {game.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ListItem>
  );
}

export default AddGame;

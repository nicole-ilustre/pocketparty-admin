import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import { getConfig, updateConfig } from "@/libs/api/config";

const StyledBox = styled(Box)(() => ({
  marginBottom: "8px",
}));

const style = {
  width: "560px",
  maxHeight: "90%",
  padding: "12px",
};

const convertGameDataToText = (gameConfigInfo, gameData) => {
  const { key, type = "STRING" } = gameConfigInfo;

  const dataList = gameData[key];

  switch (type) {
    case "JSON_ARRAY": {
      return dataList
        .map((content) => JSON.parse(content).join(" - "))
        .join("\n");
    }
    default: {
      return dataList.join("\n");
    }
  }
};

const convertTextToGameData = (gameConfigInfo, gameDataTxt) => {
  const { key, type = "STRING" } = gameConfigInfo;

  switch (type) {
    case "JSON_ARRAY": {
      let error = null;

      const list = gameDataTxt
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => {
          const words = line.split(" - ");
          if (words.length !== 2) {
            error = "Malformed data, each word should be separated by '-'";
          }
          return JSON.stringify(words.map((word) => word.trim()));
        });

      const gameData = { [key]: list };

      if (list.length === 0) {
        error = "At least one line should be added";
      }

      return { gameData, error };
    }
    default: {
      const list = gameDataTxt
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      const gameData = { [key]: list };

      let error = null;
      if (list.length === 0) {
        error = "At least one line should be added";
      }

      return { gameData, error };
    }
  }
};

function GameDataForm({ data, gameKey, onClose }) {
  const [inProgress, setInProgress] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);
  const [gameDataEditable, setGameDataEditable] = useState(null);

  useEffect(() => {
    getConfig(gameKey).then((newGameData) => {
      setGameData(newGameData);
      setGameDataEditable(convertGameDataToText(data[gameKey], newGameData));
    });
  }, [data, gameKey]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const { gameData: newGameData, error } = convertTextToGameData(
      data[gameKey],
      gameDataEditable
    );

    if (error) {
      setError(error);
      return;
    }

    setInProgress(true);
    await updateConfig(gameKey, newGameData);
    setInProgress(false);
    onClose();
  };

  return (
    <Drawer
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      anchor="right"
    >
      <>
        <Box sx={style} component="form" onSubmit={onSubmit}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit &quot;{data[gameKey].gameTitle}&quot; game data
          </Typography>
          <Box sx={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
            <StyledBox>
              <TextField
                fullWidth
                variant="standard"
                multiline
                value={gameDataEditable}
                onChange={(e) => setGameDataEditable(e.target.value)}
                error={Boolean(error)}
                helperText={error}
              />
            </StyledBox>
          </Box>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <Button variant="outlined" onClick={onClose} disabled={inProgress}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{ marginLeft: "8px" }}
              disabled={inProgress}
            >
              Submit
            </Button>
          </Box>
        </Box>
        {inProgress || gameData === null ? (
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
        ) : null}
      </>
    </Drawer>
  );
}

export default GameDataForm;

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import { getGameBySlug, updateGame, addGame } from "@/libs/api";

const StyledBox = styled(Box)(() => ({
  marginBottom: "8px",
}));

const DEFAULT_GAME = {
  age: "",
  description: "",
  filters: [],
  gameplay: "",
  cdnImage: "",
  cdnImageWebp: "",
  minutes: "",
  place: [],
  playersMin: "",
  playersMax: null,
  displayPlayers: "",
  setup: "",
  slug: "",
  subTitle: "",
  title: "",
  youtubeUrl: "",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  maxHeight: "90%",
  p: 3,
};

const getSlug = (title) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]+/g, "")
    .replace(/\s/g, "-");

const optionalKeys = ["examples", "playersMax"];

function GameForm({ data = DEFAULT_GAME, mode = "add", onClose, onSuccess }) {
  const [gameData, setGameData] = useState(data);
  const [gameErrors, setGameErrors] = useState({});
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const slugRef = useRef(null);

  const setValue = (key, value) => {
    if (inProgress) {
      return;
    }

    setGameData((existingData) => ({
      ...existingData,
      [key]: value,
    }));
  };

  const onTitleChange = (value) => {
    setValue("title", value);
    isSlugTouched === false &&
      mode !== "edit" &&
      setValue("slug", getSlug(value));
  };

  const onSlugChange = (value) => {
    setIsSlugTouched(true);
    setValue("slug", getSlug(value));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    Object.keys(gameData)
      .filter((key) => optionalKeys.includes(key) === false)
      .forEach((key) => {
        const value = gameData[key];
        if (Array.isArray(value)) {
          if (value.length === 0) {
            errors[key] = "Required";
          }
        } else if (value.trim().length === 0) {
          errors[key] = "Required";
        }
      });

    setGameErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setInProgress(true);
    const existingGame = await getGameBySlug(gameData.slug);
    if (existingGame && mode === "add") {
      errors["slug"] = "Slug is already taken";
    }

    if (existingGame && mode === "edit" && existingGame.uid !== gameData.uid) {
      errors["slug"] = "Slug is already taken";
    }

    setGameErrors(errors);
    if (Object.keys(errors).length > 0) {
      setInProgress(false);
      if (slugRef.current) {
        slugRef.current.scrollIntoView();
      }
      return;
    }

    const gameDataServer = {
      ...gameData,
      playersMax:
        gameData.playersMax && gameData.playersMax.length > 0
          ? gameData.playersMax
          : null,
    };

    if (mode === "add") {
      await addGame(gameDataServer);
    }

    if (mode === "edit") {
      await updateGame(gameDataServer);
    }

    setInProgress(false);
    onSuccess();
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        <Box sx={style} component="form" onSubmit={onSubmit}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {mode === "edit" ? "Edit Game" : "Add Game"}
          </Typography>
          <Box sx={{ maxHeight: "70vh", overflowY: "auto" }}>
            <StyledBox>
              <TextField
                fullWidth
                label="Title"
                variant="standard"
                value={gameData.title}
                onChange={(e) => onTitleChange(e.target.value)}
                error={Boolean(gameErrors.title)}
                helperText={gameErrors.title}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Sub Title"
                variant="standard"
                value={gameData.subTitle}
                onChange={(e) => setValue("subTitle", e.target.value)}
                error={Boolean(gameErrors.subTitle)}
                helperText={gameErrors.subTitle}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Slug"
                variant="standard"
                value={gameData.slug}
                onChange={(e) => onSlugChange(e.target.value)}
                error={Boolean(gameErrors.slug)}
                helperText={gameErrors.slug}
                ref={slugRef}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Image File Name"
                variant="standard"
                value={gameData.cdnImage}
                onChange={(e) => setValue("cdnImage", e.target.value)}
                error={Boolean(gameErrors.cdnImage)}
                helperText={gameErrors.cdnImage}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Image File Name (webp)"
                variant="standard"
                value={gameData.cdnImageWebp}
                onChange={(e) => setValue("cdnImageWebp", e.target.value)}
                error={Boolean(gameErrors.cdnImageWebp)}
                helperText={gameErrors.cdnImageWebp}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Youtube URL"
                variant="standard"
                value={gameData.youtubeUrl}
                onChange={(e) => setValue("youtubeUrl", e.target.value)}
                error={Boolean(gameErrors.youtubeUrl)}
                helperText={gameErrors.youtubeUrl}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Description"
                variant="standard"
                multiline
                rows={4}
                value={gameData.description}
                onChange={(e) => setValue("description", e.target.value)}
                error={Boolean(gameErrors.description)}
                helperText={gameErrors.description}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Game Play"
                variant="standard"
                multiline
                rows={4}
                value={gameData.gameplay}
                onChange={(e) => setValue("gameplay", e.target.value)}
                error={Boolean(gameErrors.gameplay)}
                helperText={gameErrors.gameplay}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Setup"
                variant="standard"
                multiline
                rows={4}
                value={gameData.setup}
                onChange={(e) => setValue("setup", e.target.value)}
                error={Boolean(gameErrors.setup)}
                helperText={gameErrors.setup}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Examples"
                variant="standard"
                multiline
                rows={4}
                value={gameData.examples}
                onChange={(e) => setValue("examples", e.target.value)}
                error={Boolean(gameErrors.examples)}
                helperText={gameErrors.examples}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Filters"
                variant="standard"
                value={gameData.filters.join(", ")}
                onChange={(e) =>
                  setValue(
                    "filters",
                    e.target.value.split(",").map((v) => v.trim())
                  )
                }
                error={Boolean(gameErrors.filters)}
                helperText={gameErrors.filters}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Place"
                variant="standard"
                value={gameData.place.join(", ")}
                onChange={(e) =>
                  setValue(
                    "place",
                    e.target.value.split(",").map((v) => v.trim())
                  )
                }
                error={Boolean(gameErrors.place)}
                helperText={gameErrors.place}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Players Min"
                variant="standard"
                value={gameData.playersMin}
                onChange={(e) => setValue("playersMin", e.target.value)}
                error={Boolean(gameErrors.playersMin)}
                helperText={gameErrors.playersMin}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Players Max (Optional)"
                variant="standard"
                value={gameData.playersMax || ""}
                onChange={(e) => setValue("playersMax", e.target.value)}
                error={Boolean(gameErrors.playersMax)}
                helperText={gameErrors.playersMax}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="Display Players"
                variant="standard"
                value={gameData.displayPlayers}
                onChange={(e) => setValue("displayPlayers", e.target.value)}
                error={Boolean(gameErrors.displayPlayers)}
                helperText={gameErrors.displayPlayers}
              />
            </StyledBox>

            <StyledBox>
              <TextField
                fullWidth
                label="Age"
                variant="standard"
                value={gameData.age}
                onChange={(e) => setValue("age", e.target.value)}
                error={Boolean(gameErrors.age)}
                helperText={gameErrors.age}
              />
            </StyledBox>
            <StyledBox>
              <TextField
                fullWidth
                label="minutes"
                variant="standard"
                value={gameData.minutes}
                onChange={(e) => setValue("minutes", e.target.value)}
                error={Boolean(gameErrors.minutes)}
                helperText={gameErrors.minutes}
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
        {inProgress ? (
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
    </Modal>
  );
}

export default GameForm;

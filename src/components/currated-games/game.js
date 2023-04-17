import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import KeyboardDoubleArrowUp from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDown from "@mui/icons-material/KeyboardDoubleArrowDown";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";

function Game({ text, onMove, onDelete }) {
  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="Up"
            style={{ marginRight: "4px" }}
            onClick={() => onMove("up")}
          >
            <KeyboardDoubleArrowUp />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="Down"
            style={{ marginRight: "4px" }}
            onClick={() => onMove("down")}
          >
            <KeyboardDoubleArrowDown />
          </IconButton>
          <IconButton edge="end" aria-label="Delete" onClick={onDelete}>
            <Delete />
          </IconButton>
        </>
      }
    >
      <ListItemText primary={text} />
    </ListItem>
  );
}

export default Game;

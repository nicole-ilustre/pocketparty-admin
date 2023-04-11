import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import KeyboardDoubleArrowUp from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDown from "@mui/icons-material/KeyboardDoubleArrowDown";
import IconButton from "@mui/material/IconButton";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";

function Filter({ text, onMove, hasChanged }) {
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
            onClick={() => onMove("down")}
          >
            <KeyboardDoubleArrowDown />
          </IconButton>
        </>
      }
    >
      {hasChanged ? (
        <ListItemAvatar>
          <Avatar variant="rounded">
            <DownloadDoneIcon />
          </Avatar>
        </ListItemAvatar>
      ) : null}
      <ListItemText primary={text} />
    </ListItem>
  );
}

export default Filter;

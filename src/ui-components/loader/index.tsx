import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Loader() {
  return (
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
  );
}

export default Loader;

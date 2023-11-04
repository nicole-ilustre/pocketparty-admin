import { useMemo, useState } from "react";
import { styled } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import GameDataForm from "./game-data-form";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function GameData({ gameData, onSave }) {
  const [editGameKey, setEditGameKey] = useState(null);

  const gameDataList = useMemo(() => {
    const localData = { ...gameData };
    delete localData.id;

    return Object.keys(localData)
      .sort((a, b) => a.localeCompare(b))
      .map((gameKey) => ({
        gameKey,
        ...gameData[gameKey],
      }));
  }, [gameData]);

  console.log(gameDataList);

  return (
    <>
      <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Game</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gameDataList.map((row) => (
                <StyledTableRow key={row.gameKey}>
                  <StyledTableCell component="th" scope="row">
                    {row.gameTitle}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      variant="outlined"
                      onClick={() => setEditGameKey(row.gameKey)}
                    >
                      <EditIcon />
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      {editGameKey !== null && (
        <GameDataForm
          data={gameData}
          gameKey={editGameKey}
          onClose={() => setEditGameKey(null)}
        />
      )}
    </>
  );
}

export default GameData;

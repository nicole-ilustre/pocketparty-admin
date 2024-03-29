import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Chip from "@mui/material/Chip";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

import GameForm from "@/components/game-form";
import Loader from "@/ui-components/loader";

import { deleteGame as deleteGameApi, getGames } from "@/libs/api";

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

export default function Home() {
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [deleteGame, setDeleteGame] = useState(null);

  useEffect(() => {
    getGames().then((data) => {
      setData(data);
      setShowData(true);
    });
  }, []);

  const onSuccess = async () => {
    setShowData(false);

    getGames().then((data) => {
      setData(data);
      setShowData(true);
    });
  };

  const onDeleteGame = async () => {
    setShowData(false);

    await deleteGameApi(deleteGame);
    setDeleteGame(null);
    onSuccess();
  };

  if (showData === false) {
    return <Loader />;
  }

  return (
    <>
      <main>
        <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>
          <Typography variant="h4" sx={{ marginBottom: "16px" }}>
            Pocket Party - Games
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "10px",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<AddCircleIcon />}
              onClick={() => setShowAddForm(true)}
            >
              New Game
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell>Sub Title</StyledTableCell>
                  <StyledTableCell>Filters</StyledTableCell>
                  <StyledTableCell>Public</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <StyledTableRow key={row.uid}>
                    <StyledTableCell component="th" scope="row">
                      {row.title}
                    </StyledTableCell>
                    <StyledTableCell>{row.subTitle}</StyledTableCell>
                    <StyledTableCell>
                      {[...row.place, row.filters].join(", ")}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.isPublic ? (
                        <Chip label="Public" color="info" />
                      ) : (
                        <Chip label="Draft" color="warning" />
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <ButtonGroup variant="outlined" size="small">
                        <Button onClick={() => setEditFormData(row)}>
                          <EditIcon />
                        </Button>
                        <Button onClick={() => setDeleteGame(row.uid)}>
                          <DeleteIcon />
                        </Button>
                      </ButtonGroup>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </main>
      {showAddForm ? (
        <GameForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            onSuccess();
          }}
        />
      ) : null}
      {editFormData ? (
        <GameForm
          data={editFormData}
          mode="edit"
          onClose={() => setEditFormData(null)}
          onSuccess={() => {
            setEditFormData(null);
            onSuccess();
          }}
        />
      ) : null}
      <Dialog
        open={deleteGame !== null}
        onClose={() => setDeleteGame(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Do you want to delete this game ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteGame(null)}>No</Button>
          <Button onClick={onDeleteGame} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

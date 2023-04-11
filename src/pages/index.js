import { useEffect, useState } from "react";
import Head from "next/head";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
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

import { deleteGame as deleteGameApi } from "@/libs/api";

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
    fetch("/api/get-games")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setShowData(true);
      });
  }, []);

  const onSuccess = async () => {
    setShowData(false);

    fetch("/api/get-games")
      .then((response) => response.json())
      .then((data) => {
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

  return (
    <>
      <Head>
        <title>Pocket Party - Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {showData ? (
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

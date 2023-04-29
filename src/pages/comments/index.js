import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import * as dayjs from "dayjs";

import Loader from "@/ui-components/loader";

import { getComments } from "@/libs/api/comments";
import { getGames } from "@/libs/api";

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

const PAGINATION_LENGTH = 50;

function Comments() {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [games, setGames] = useState({});

  useEffect(() => {
    Promise.all([getComments(), getGames()]).then(([{ data }, games]) => {
      setComments(data);
      const gamesHash = {};
      games.forEach((game) => {
        gamesHash[game.uid] = game;
      });
      setGames(gamesHash);
      setShowComments(true);
      setShowNext(data.length === PAGINATION_LENGTH);
    });
  }, []);

  const nextPage = () => {
    setShowComments(false);
    const startAfterUid = comments[comments.length - 1].uid;
    getComments({ startAfterUid }).then(({ data }) => {
      setComments(data);
      setShowComments(true);
      setShowNext(data.length === PAGINATION_LENGTH);
      setShowPrevious(true);
    });
  };

  const prevPage = () => {
    setShowComments(false);
    const endBeforeUid = comments[0].uid;
    getComments({ endBeforeUid }).then(({ data }) => {
      if (data.length === 0) {
        setShowPrevious(false);
        setShowComments(true);
        return;
      }

      setComments(data);
      setShowComments(true);
      setShowNext(true);
      setShowPrevious(true);
    });
  };

  if (showComments === false) {
    return <Loader />;
  }

  return (
    <main>
      <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Author</StyledTableCell>
                <StyledTableCell>Game</StyledTableCell>
                <StyledTableCell>Comment</StyledTableCell>
                <StyledTableCell>Is Reply</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments.map((row) => (
                <StyledTableRow key={row.uid}>
                  <StyledTableCell component="th" scope="row">
                    {row.authorName}
                  </StyledTableCell>
                  <StyledTableCell>
                    <a
                      href={`https://pocketparty.app/game/${
                        games[row.gameID]?.slug
                      }`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {games[row.gameID]?.title}
                    </a>
                  </StyledTableCell>
                  <StyledTableCell>{row.comment}</StyledTableCell>
                  <StyledTableCell>
                    {row.parentCommentID !== null ? (
                      <Chip label="Reply" color="info" />
                    ) : null}
                  </StyledTableCell>
                  <StyledTableCell>
                    {dayjs(row.createdAt).format("DD/MM/YYYY")}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "8px",
          }}
        >
          {showPrevious && <Button onClick={prevPage}>Previous</Button>}
          {showNext && <Button onClick={nextPage}>Next</Button>}
        </Box>
      </Container>
    </main>
  );
}

export default Comments;

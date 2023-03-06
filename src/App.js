import { useState } from "react";

function Square({ value, onSquareClick, isWinSquare }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ backgroundColor: isWinSquare && "#00ff00" }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  const isDraw = !squares.some((element) => element === null);
  let status;
  let winLine;
  if (winner) {
    status = "Winner: " + winner.player;
    winLine = winner.line;
  } else if (isDraw) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const board = [];

  function addScuares(i) {
    const row = [];
    for (let j = i; j < i + 3; j++) {
      let isWinSquare = false;
      if (winLine) {
        isWinSquare = winLine.some((element) => element === j);
      }
      row.push(
        <Square
          value={squares[j]}
          onSquareClick={() => handleClick(j)}
          isWinSquare={isWinSquare}
        />
      );
    }
    return row;
  }

  for (let i = 0; i < 9; i += 3) {
    board.push(<div className="board-row">{addScuares(i)}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div>{board}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [areMovesReverse, setAreMovesReverse] = useState(false);
  const [clickedSquares, setClickedSquares] = useState([null]);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextClickedSquares = [...clickedSquares.slice(0, currentMove + 1), i];
    setHistory(nextHistory);
    setClickedSquares(nextClickedSquares);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move, array) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    let col;
    let row;
    let player;
    if (clickedSquares) {
      col = getColRow(clickedSquares[move])?.col;
      row = getColRow(clickedSquares[move])?.row;
    }
    if (move % 2 !== 0) {
      player = "X";
    } else {
      player = "O";
    }

    let movesListElement;
    if (move === currentMove) {
      movesListElement = (
        <li key={move}>
          You are at move #{currentMove}
          {col && (
            <span>
              {" -- "}Player: {player} Col: {col} Row: {row}
            </span>
          )}
        </li>
      );
    } else {
      movesListElement = (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
          {col && (
            <span>
              {" -- "}Player: {player} Col: {col} Row: {row}
            </span>
          )}
        </li>
      );
    }
    return movesListElement;
  });

  let movesFinal;

  if (areMovesReverse) {
    movesFinal = moves;
    movesFinal.reverse();
  } else {
    movesFinal = moves;
  }

  function reverseMoves() {
    setAreMovesReverse(!areMovesReverse);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={reverseMoves}>Reverse moves</button>
        <ol className="game-moves">{movesFinal}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winLine = lines[i].slice();
      return {
        player: squares[a],
        line: winLine
      };
    }
  }
  return null;
}

function getColRow(i) {
  const squares = [];
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      squares.push({
        col: j,
        row: i
      });
    }
  }
  return squares[i];
}

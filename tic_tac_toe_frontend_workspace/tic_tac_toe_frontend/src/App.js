import React, { useState, useEffect } from 'react';
import './App.css';

// Color palette
const COLORS = {
  primary: '#1976d2',
  secondary: '#ffffff',
  accent: '#f44336',
  // Fallback greys
  border: '#e9ecef',
  cellBg: '#f8f9fa',
  win: '#d4edda',
  tie: '#fffbe6'
};

/**
 * PUBLIC_INTERFACE
 * Single cell in the tic tac toe board.
 */
function Cell({ value, onClick, isWinning, disabled, index }) {
  return (
    <button
      className={`ttt-cell${isWinning ? ' winning' : ''}`}
      onClick={onClick}
      disabled={disabled || !!value}
      aria-label={`Cell ${index}: ${value ? value : 'empty'}`}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * Main Tic Tac Toe App component.
 */
function App() {
  // State
  const [board, setBoard] = useState(Array(9).fill(null));      // 0-based: 0..8
  const [xIsNext, setXIsNext] = useState(true);                 // true: X's turn, false: O's turn
  const [winnerInfo, setWinnerInfo] = useState(null);           // {winner, line} | null
  const [score, setScore] = useState({ X: 0, O: 0, tie: 0 });
  const [gameOver, setGameOver] = useState(false);

  // On move, check for win/tie
  useEffect(() => {
    const res = calculateWinner(board);
    if (res) {
      setWinnerInfo(res);
      setGameOver(true);
      if (res.winner === 'X' || res.winner === 'O') {
        setScore((s) => ({ ...s, [res.winner]: s[res.winner] + 1 }));
      } else if (res.winner === 'Tie') {
        setScore((s) => ({ ...s, tie: s.tie + 1 }));
      }
    } else {
      setWinnerInfo(null);
      setGameOver(false);
    }
  }, [board]);

  // Handler: cell click
  // PUBLIC_INTERFACE
  const handleClick = (idx) => {
    if (board[idx] || gameOver) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  };

  // Handler: restart game
  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(winnerInfo && winnerInfo.winner === 'O'); // Alternate who starts
    setWinnerInfo(null);
    setGameOver(false);
  };

  // Handler: reset all scores
  // PUBLIC_INTERFACE
  const handleResetScores = () => {
    setScore({ X: 0, O: 0, tie: 0 });
    handleRestart();
  };

  // Build winning highlight info
  const winningLine = winnerInfo && winnerInfo.line;

  // Status message
  let status;
  if (winnerInfo) {
    status =
      winnerInfo.winner === 'Tie'
        ? "It's a tie!"
        : `Winner: ${winnerInfo.winner}`;
  } else {
    status = `Turn: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="ttt-root">
      <main className="ttt-main">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <section className="ttt-score">
          <ScoreBoard score={score} />
        </section>

        <section className="ttt-status">
          <StatusIndicator status={status} turn={xIsNext ? 'X' : 'O'} winner={winnerInfo?.winner} />
        </section>

        <section className="ttt-board-container">
          <Board
            board={board}
            onCellClick={handleClick}
            winningLine={winningLine}
            gameOver={gameOver}
          />
        </section>

        <section className="ttt-buttons">
          <button className="ttt-btn" onClick={handleRestart}>
            {winnerInfo ? "Play Again" : "Restart"}
          </button>
          <button className="ttt-btn reset" onClick={handleResetScores}>
            Reset Scores
          </button>
        </section>
      </main>
      <footer className="ttt-footer">
        <span>Modern, minimalistic design.</span>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * ScoreBoard
 */
function ScoreBoard({ score }) {
  return (
    <div className="ttt-score-board" aria-label="Score board">
      <div className="ttt-score-x" style={{ color: COLORS.primary }}>X</div>
      <div className="ttt-score-value">{score.X}</div>
      <div className="ttt-score-o" style={{ color: COLORS.accent }}>O</div>
      <div className="ttt-score-value">{score.O}</div>
      <div className="ttt-score-tie" style={{ color: '#888' }}>Tie</div>
      <div className="ttt-score-value">{score.tie}</div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Status display
 */
function StatusIndicator({ status, turn, winner }) {
  let color = COLORS.primary;
  if (winner === 'O') color = COLORS.accent;
  if (winner === 'Tie') color = '#888';
  if (!winner && turn === 'O') color = COLORS.accent;

  return (
    <div className="ttt-status-indicator" style={{ color }}>
      {status}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board display
 */
function Board({ board, onCellClick, winningLine, gameOver }) {
  return (
    <div className="ttt-board" role="grid">
      {board.map((value, idx) => (
        <Cell
          key={idx}
          value={value}
          onClick={() => onCellClick(idx)}
          isWinning={winningLine ? winningLine.includes(idx) : false}
          disabled={gameOver}
          index={idx}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Calculate winner or tie.
 */
function calculateWinner(squares) {
  // 3x3 lines
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8], // diags
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  // Tie if no nulls remain and no winner
  if (squares.every(Boolean)) {
    return { winner: 'Tie', line: [] };
  }
  return null;
}

export default App;

import type { Cell, Position } from './types';

export const BOARD_ROWS = 8;
export const BOARD_COLS = 6;

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function createInitialBoard(bugTypeCount: number): Cell[][] {
  const board: Cell[][] = Array(BOARD_ROWS)
    .fill(null)
    .map(() => Array(BOARD_COLS).fill(null).map(() => ({ type: 0, id: '' })));

  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      let type: number;
      let attempts = 0;
      do {
        type = Math.floor(Math.random() * bugTypeCount);
        attempts++;
      } while (
        attempts < 50 &&
        (
          (col >= 2 && board[row][col - 1].type === type && board[row][col - 2].type === type) ||
          (row >= 2 && board[row - 1][col].type === type && board[row - 2][col].type === type)
        )
      );
      board[row][col] = { type, id: generateId() };
    }
  }

  return board;
}

export function findMatches(board: Cell[][]): Position[] {
  const matched = new Set<string>();

  // Horizontal matches
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS - 2; col++) {
      const type = board[row][col].type;
      if (type === -1) continue;
      if (board[row][col + 1].type === type && board[row][col + 2].type === type) {
        let end = col + 2;
        while (end + 1 < BOARD_COLS && board[row][end + 1].type === type) end++;
        for (let c = col; c <= end; c++) matched.add(`${row},${c}`);
        col = end;
      }
    }
  }

  // Vertical matches
  for (let col = 0; col < BOARD_COLS; col++) {
    for (let row = 0; row < BOARD_ROWS - 2; row++) {
      const type = board[row][col].type;
      if (type === -1) continue;
      if (board[row + 1][col].type === type && board[row + 2][col].type === type) {
        let end = row + 2;
        while (end + 1 < BOARD_ROWS && board[end + 1][col].type === type) end++;
        for (let r = row; r <= end; r++) matched.add(`${r},${col}`);
        row = end;
      }
    }
  }

  return Array.from(matched).map((key) => {
    const [r, c] = key.split(',').map(Number);
    return { row: r, col: c };
  });
}

export function applyGravity(board: Cell[][]): Cell[][] {
  const newBoard = board.map((row) => [...row]);

  for (let col = 0; col < BOARD_COLS; col++) {
    let emptyRow = BOARD_ROWS - 1;
    for (let row = BOARD_ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col].type !== -1) {
        if (row !== emptyRow) {
          newBoard[emptyRow][col] = newBoard[row][col];
          newBoard[row][col] = { type: -1, id: generateId() };
        }
        emptyRow--;
      }
    }
  }

  return newBoard;
}

export function fillBoard(board: Cell[][], bugTypeCount: number): Cell[][] {
  const newBoard = board.map((row) => [...row]);

  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      if (newBoard[row][col].type === -1) {
        newBoard[row][col] = {
          type: Math.floor(Math.random() * bugTypeCount),
          id: generateId(),
        };
      }
    }
  }

  return newBoard;
}

export function hasValidMoves(board: Cell[][]): boolean {
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      if (col < BOARD_COLS - 1) {
        const tb = board.map((r) => [...r]);
        [tb[row][col], tb[row][col + 1]] = [tb[row][col + 1], tb[row][col]];
        if (findMatches(tb).length > 0) return true;
      }
      if (row < BOARD_ROWS - 1) {
        const tb = board.map((r) => [...r]);
        [tb[row][col], tb[row + 1][col]] = [tb[row + 1][col], tb[row][col]];
        if (findMatches(tb).length > 0) return true;
      }
    }
  }
  return false;
}

export function countBugTypes(matches: Position[], board: Cell[][]): Record<number, number> {
  const counts: Record<number, number> = {};
  matches.forEach(({ row, col }) => {
    const type = board[row][col].type;
    if (type >= 0) counts[type] = (counts[type] || 0) + 1;
  });
  return counts;
}

export function clearRow(board: Cell[][], rowIndex: number): Cell[][] {
  const newBoard = board.map((r) => [...r]);
  for (let col = 0; col < BOARD_COLS; col++) {
    newBoard[rowIndex][col] = { type: -1, id: generateId() };
  }
  return newBoard;
}

export function removeMostCommonBug(board: Cell[][]): { newBoard: Cell[][]; bugType: number; count: number } {
  const counts: Record<number, number> = {};
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      const t = board[row][col].type;
      if (t >= 0) counts[t] = (counts[t] || 0) + 1;
    }
  }
  const bugType = parseInt(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
  const newBoard = board.map((r) => [...r]);
  let count = 0;
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      if (newBoard[row][col].type === bugType) {
        newBoard[row][col] = { type: -1, id: generateId() };
        count++;
      }
    }
  }
  return { newBoard, bugType, count };
}

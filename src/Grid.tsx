import { SquareProps } from "./Square";
import Square from "./Square";
import { useState, useEffect } from "react";

type GridProps = {
  width: number,
  height: number,
  bombs: number
}
const Grid = ({ width, height, bombs }: GridProps) => {
  const [started, setStarted] = useState(false);

  const forNeighbors = (row: number, col: number, func: (nrow: number, ncol: number) => void) => {
    for (let neighborRow = row - 1; neighborRow <= row + 1; neighborRow++) {
      for (let neighborCol = col - 1; neighborCol <= col + 1; neighborCol++) {
        if (!(row === neighborRow && col === neighborCol)
          && neighborRow >= 0 && neighborRow < height
          && neighborCol >= 0 && neighborCol < width) {
          func(neighborRow, neighborCol);
        }
      }
    }
  }


  const initGrid = () => {
    console.log('initGrid');


    const fillEmptyGrid = () => {
      let emptyGrid: SquareProps[][] = [];
      for (let r = 0; r < height; r++) {
        emptyGrid[r] = [];
        for (let c = 0; c < width; c++) {
          emptyGrid[r][c] = {
            squareType: 'EMPTY',
            onClick: (e) => handleSquareClick(e, r, c),
            hidden: true,
            flag: false
          };
        }
      }
      return emptyGrid;
    }

    const setBombs = (grid: SquareProps[][]) => {
      let currentGrid = [...grid];
      let bombsToPlace = bombs;
      while (bombsToPlace > 0) {
        const row: number = Math.floor(Math.random() * height);
        const col: number = Math.floor(Math.random() * width);
        if (currentGrid[row][col].squareType !== 'BOMB') {
          currentGrid[row][col].squareType = 'BOMB';
          bombsToPlace--;
        }
      }
      return currentGrid;
    }

    const fillNumbers = (grid: SquareProps[][]) => {
      let currentGrid = [...grid];
      for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
          const square = currentGrid[r][c];
          let bombs: number = 0;
          if (square.squareType !== 'BOMB') {
            forNeighbors(r, c, (r_check, c_check) => {
              if (currentGrid[r_check][c_check].squareType === 'BOMB') {
                bombs++;
              }
            });
          }
          if (bombs > 0) {
            currentGrid[r][c].squareType = 'NUMBER';
            currentGrid[r][c].number = bombs;
          }
        }
      }
      return currentGrid;
    }

    let grid = fillEmptyGrid();
    grid = setBombs(grid);
    grid = fillNumbers(grid);
    return grid;
  }

  const [squares, setSquares] = useState<SquareProps[][]>(() => initGrid());

  const handleSquareClick = (e: React.MouseEvent<HTMLElement>, row: number, col: number) => {
    if (e.type === 'click') {
      if (!started) {
        let squaresCopy = [...squares];
        console.log('orig: ' + squaresCopy[row][col].squareType);
        while (squaresCopy[row][col].squareType === 'BOMB') {
          console.log('bomb');
          squaresCopy = initGrid();
          console.log('gen: ' + squaresCopy[row][col].squareType);
        }
        console.log('final: ' + squaresCopy[row][col].squareType);
        setSquares(() => squaresCopy);
        setStarted(true);
      }
      revealSquare(row, col);
    }
    else if (e.type === 'contextmenu') {
      e.preventDefault();
      flagSquare(row, col);
    }
  }

  const flagSquare = (row: number, col: number) => {
    if (squares[row][col].hidden) {
      const squaresCopy = [...squares];
      squaresCopy[row][col].flag = !squaresCopy[row][col].flag;
      setSquares(squaresCopy);
    }
  }

  const revealNeighbors = (row: number, col: number) => {
    forNeighbors(row, col,
      (neighborRow, neighborCol) => {
        if (squares[neighborRow][neighborCol].hidden) {
          revealSquare(neighborRow, neighborCol);
        }
      }
    );
  }

  const revealSquare = (row: number, col: number) => {
    console.log('reveal square');
    const squaresCopy = [...squares];
    const square: SquareProps = { ...squares[row][col] };

    if (square.hidden && !square.flag) {
      squaresCopy[row][col].hidden = false;
      setSquares(squaresCopy);
      if (square.squareType === 'EMPTY') {
        revealNeighbors(row, col);
      }
    }

    if (!square.hidden && square.squareType === 'NUMBER') {
      let neighborFlags = 0;
      forNeighbors(row, col, (neighborRow, neighborCol) => {
        if (squares[neighborRow][neighborCol].flag) {
          neighborFlags++;
        }
      });
      if (neighborFlags === square.number) {
        revealNeighbors(row, col);
      }
    }
  }

  // TODO: win condition
  const won = () => false;

  return (
    won() ? <p>You win!</p> : (
      <div>
        {squares.map((squareArray, row) => {
          return <div key={'row' + row}>
            {squareArray.map((squareProps, col) => {
              return <Square key={`square ${row} ${col} ${squareProps.squareType}`} {...squareProps}
              />
            })}
          </div>
        })}
        <button onClick={() => {
          setStarted(false);
          let grid = initGrid();
          setSquares((origSquares) => grid);
          console.log('grid');
          console.log(grid)
          console.log('squares');
          console.log(squares);
        }}>Reset</button>
      </div>
    )
  );
}

export default Grid;
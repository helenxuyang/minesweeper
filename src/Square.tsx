import React from 'react';
import './Square.css';

type SquareType = 'EMPTY' | 'BOMB' | 'NUMBER';

type SquareProps = {
  squareType: SquareType,
  number?: number,
  onClick: (e: React.MouseEvent<HTMLElement>) => void,
  hidden: boolean,
  flag: boolean
}

const Square = ({ squareType, number, onClick, hidden, flag }: SquareProps) => {
  let symbol: string = '';
  if (flag) {
    symbol = '🚩';
  }
  else if (hidden) {
    symbol = ' ';
  }
  else {
    switch (squareType) {
      case ('EMPTY'):
        break;
      case ('BOMB'):
        symbol = '💣';
        break;
      case ('NUMBER'):
        if (number) {
          symbol = number.toString();
        }
        break;
      default:
        throw new Error("Invalid square type");
    }
  }
  return <button
    className={squareType === 'EMPTY' && !hidden ? 'empty' : ''}
    onClick={onClick}
    onContextMenu={onClick}
  >
    {symbol}
  </button>;
}

export default Square;
export type { SquareProps };
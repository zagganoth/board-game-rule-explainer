import React from 'react';
import BoardGameCard from './BoardGameCard';

const BoardGameCardGrid = (props: { games: string[] }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {props.games.map((gameName: string, index: number) => {
        return <BoardGameCard key={index} gameName={gameName} />;
      })}
    </div>
  );
};

export default BoardGameCardGrid;
